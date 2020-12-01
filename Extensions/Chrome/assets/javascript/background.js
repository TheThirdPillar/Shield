const domain = "http://localhost:3000"

// TODO: Promise rejects should return of type Error

function generateKeys () {
    try {
        let userKey = keyPair();
        return [null, userKey];
    } catch (err) {
        return [err.message, null];
    }
}

function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2);
}

function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}

function encryptData(data) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(["shieldAccount"], (result) => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if (!tabs) return reject('Unable to connect to the content script.')
                    chrome.tabs.sendMessage(tabs[0].id, {query: 'userPassword'}, (response) => {
                        if (response.status !== 'SUCCESS') return reject("User declined gracefully.")
                        let userPublicKey = result.shieldAccount.publicKey
                        let decryptedPrivateKey = CryptoJS.AES.decrypt(result.shieldAccount.privateKeyEncrypted, response.password).toString(CryptoJS.enc.Utf8)
    
                        // Generate 20 character key to encrypt the data
                        var aesKey = generateId(20)
                        // Encrypt the file
                        let encryptedFile = CryptoJS.AES.encrypt(data, aesKey).toString()
                        // Encrypt the key
                        let encryptedKey = encryptPublic(aesKey, userPublicKey, decryptedPrivateKey)
                        // Return the encryptedkey and data
                        let reply = {}
                        reply.encryptedFile = encryptedFile
                        reply.encryptedKey = encryptedKey.data + "::" + encryptedKey.nonce
                        reply.status = 'SUCCESS'
                        return resolve(reply) 
                    })
                })
            })
        } catch (error) {
            console.error(error)
            return reject('Unable to encrypt record at the moment.')
        }
    })
}

function shareKey(encryptedKey, receiverPublicKey) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(["shieldAccount"], (result) => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if (!tabs) return reject('Unable to connect to the content script.')
                    chrome.tabs.sendMessage(tabs[0].id, {query: 'userPassword'}, (response) => {
                        if (response.status !== 'SUCCESS') return reject("User declined gracefully.")
                        let userPublicKey = result.shieldAccount.publicKey
                        let decryptedPrivateKey = CryptoJS.AES.decrypt(result.shieldAccount.privateKeyEncrypted, response.password).toString(CryptoJS.enc.Utf8)
                        // Split the key into data and nonce
                        let keyToBeShared = encryptedKey.split('::')
                        // Decrypt the key to be shared
                        let decryptedKeyToBeShared = decryptPrivate(keyToBeShared[0], keyToBeShared[1], userPublicKey, decryptedPrivateKey)
                        let encryptedKeyToBeShared = encryptPublic(decryptedKeyToBeShared, receiverPublicKey, decryptedPrivateKey)

                        let reply = {}
                        reply.status = 'SUCCESS'
                        reply.sharedKey = encryptedKeyToBeShared.data + "::" + encryptedKeyToBeShared.nonce
                        reply.receiverPublicKey = receiverPublicKey
                        return resolve(reply)
                    })                    
                })
            })
        } catch (error) {
            return reject('Unable to share key at the moment.')
        }
    })
}

function decryptData(encryptedData, encryptedKey, originalPublicKey) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(['shieldAccount'], (result) => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if (!tabs) return reject('Unable to connect to the content script.')
                    chrome.tabs.sendMessage(tabs[0].id, {query: 'userPassword'}, (response) => {
                        if (response.status !== 'SUCCESS') return reject("User declined gracefully.")
                        let userPublicKey = result.shieldAccount.publicKey
                        let decryptedPrivateKey = CryptoJS.AES.decrypt(result.shieldAccount.privateKeyEncrypted, response.password).toString(CryptoJS.enc.Utf8)
                        // Check case
                        if (!originalPublicKey) {
                            originalPublicKey = userPublicKey
                        }
                        // Split the key to get data and nonce and then decrypt the said key
                        let actualEncryptedKey = encryptedKey.split('::')
                        let actualKey = decryptPrivate(actualEncryptedKey[0], actualEncryptedKey[1], originalPublicKey, decryptedPrivateKey)
                        // Decrypt the file
                        let decryptedData = CryptoJS.AES.decrypt(encryptedData, actualKey).toString(CryptoJS.enc.Utf8)

                        let reply = {}
                        reply.status = 'SUCCESS'
                        reply.decryptedData = decryptedData
                        return resolve(reply)
                    })
                })
            })
        } catch (error) {
            return reject('Unable to decrypt data at the moment.')
        }
    })
}

function addAccount(accountDetails) {
    // We have to create a chromeStorage
    // privateKey should be encrypted.
    let account = {
        email: accountDetails.email,
        publicKey: accountDetails.publicKey,
        privateKeyEncrypted: CryptoJS.AES.encrypt(accountDetails.privateKey, accountDetails.password).toString(),
        shieldDB: [],
        sessions: []
    }
    // TODO: Add error handling
    chrome.storage.local.set({shieldAccount: account}, () => {
    })
    return "Success"
}

// TODO: Have to think of all the edge cases
function handleLogin(applicationId) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["shieldAccount"], (result) => {
            let request = {}
            let token = generateId(128)
            // Call content to get user password
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {query: 'userPassword'}, (response) => {
                    // TODO:  Wrong password handler
                    // Decrypt the encryptedPrivateKey - Wrong password handler
                    // Sign the token
                    if (response.status === 'DECLINED') return reject("User declined gracefully.")
                    decryptedPrivateKey = CryptoJS.AES.decrypt(result.shieldAccount.privateKeyEncrypted, response.password).toString(CryptoJS.enc.Utf8)
                    tokenSignature = signPrivate(token, decryptedPrivateKey)
                    // Prepare the request
                    request.token = token
                    request.tokenSignature = tokenSignature
                    request.publicKey = result.shieldAccount.publicKey
                    // Send the POST request
                    fetch(domain + '/user/' + applicationId + '/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(request)
                    })
                    .then(serverResponse => {
                        return serverResponse.json()
                    })
                    .then(json => {
                        //TODO: Better handles for different responses.
                        //TODO: Push JWT token also into sessions of shield storage.
                        if (json.status === 'SUCCESS') {
                            if (result.shieldAccount.shieldDB.includes(applicationId)) {
                                result.shieldAccount.sessions.push({application: applicationId, session: json.userApplication.sessionToken})
                            } else {
                                result.shieldAccount.shieldDB.push(applicationId)
                                result.shieldAccount.sessions.push({application: applicationId, session: json.userApplication.sessionToken})
                            }
                            chrome.storage.local.set({shieldAccount: result.shieldAccount}, () => {})
                            return resolve(json)
                        } else {
                            return reject("Failed to login, server error.")
                        }
                    })
                    .catch((error) => {
                        // TODO: Server errors and failures handlers
                        console.error(error)
                        defaultIcon()
                    })
                })
            })
        })
    }).catch(error => {
        console.error(error)
    })
}

function handleLougout(applicationId) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['shieldAccount'], (result) => {
            result.shieldAccount.sessions.splice(result.shieldAccount.sessions.findIndex(session => session.application === applicationId), 1)
            chrome.storage.local.set({shieldAccount: result.shieldAccount}, () => {})
            return resolve({status: "SUCCESS"})
        })
    })
}

function changeIcon() {
    chrome.browserAction.setIcon({
        path: { "16": '/assets/images/favicon-16x16.png', "32": '/assets/images/favicon-32x32.png' }
    });
}

function defaultIcon() {
    chrome.browserAction.setIcon({
        path: { "16": '/assets/images/faviconOffline-16x16.png', "32": '/assets/images/faviconOffline-32x32.png' }
    });
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Create keypair and store the `account` json object in chromeStorage
        chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/install.html`}, function (tab) {});
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    let response = {}

    if (request.query === 'generateKeys') {
        let key = generateKeys()
        response.status = key[0]
        response.keyPair = key[1]
    }

    if (request.query === 'addAccount') {
        response.status = 'Success'
        response.message = addAccount(request.text)
    }

    sendResponse(response)
})

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    
    let response= {}

    if (request.query === 'isExtensionAvailable') {
        response.status = 'SUCCESS'
        sendResponse(response)
    }

    if (request.query === 'shieldLogin') {
        changeIcon()
        handleLogin(request.applicationId)
            .then((result) => {
                //TODO: Better response
                defaultIcon()
                if (result && result.status && result.status === 'SUCCESS')  {
                    sendResponse(result)
                } else {
                    response.status = 'FAILED',
                    response.message = 'Unable to login at this moment'
                    sendResponse(response)
                }
            })
    }

    if (request.query === 'shieldLogout') {
        handleLougout(request.applicationId)
            .then((result) => {
                sendResponse(result)
            })
    }

    if (request.query === 'encrypt') {
        changeIcon()
        encryptData(request.data)
        .then((result) => {
            defaultIcon()
            if (result && result.status && result.status === 'SUCCESS')  {
                console.log("Yes")
                console.log(result)
                sendResponse(result)
            } else {
                response.status = 'FAILED',
                response.message = 'Unable to encrypt at this moment'
                sendResponse(response)
            }
        })
    }

    if (request.query === 'share') {
        changeIcon()
        console.log(request.data)
        shareKey(request.data.encryptedKey, request.data.receiverPublicKey)
        .then((result) => {
            defaultIcon()
            if (result && result.status && result.status === 'SUCCESS')  {
                console.log("Yes")
                console.log(result)
                sendResponse(result)
            } else {
                response.status = 'FAILED',
                response.message = 'Unable to share key at the moment.'
                sendResponse(response)
            }
        })
    }

    if (request.query === 'decrypt') {
        changeIcon()
        console.log(request.data)
        decryptData(request.data.encryptedData, request.data.encryptedKey, request.data.originalPublicKey)
        .then((result) => {
            defaultIcon()
            if (result && result.status && result.status === 'SUCCESS')  {
                console.log("Yes")
                console.log(result)
                sendResponse(result)
            } else {
                response.status = 'FAILED',
                response.message = 'Unable to decrypt data at the moment.'
                sendResponse(response)
            }
        })
    }

    return true

})