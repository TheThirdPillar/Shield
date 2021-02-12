const domain = 'https://api.skillschain.org'

function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

window.onload = () => {
    chrome.runtime.sendMessage({query: 'generateKeys'}, (response) => {
        if (response.keyPair === null) return; // Handle error here
        document.getElementById('publicKey').value = response.keyPair.publicKey
        document.getElementById('privateKey').value = response.keyPair.secretKey
    })
    document.getElementById("confirmPassword").addEventListener('input', (e) => {
        if (e.target.value !== document.getElementById('password').value) {
            e.target.setCustomValidity('Password Must be Matching.')
        } else {
            e.target.setCustomValidity('')
        }
    })
    document.getElementById("shieldRegistration").addEventListener('submit', async (e) => {
        e.preventDefault()
        let alert = document.getElementById('alert')
        let inputs = e.target.elements

        let postBody = {}
        postBody['publicKey'] = inputs.publicKey.value
        postBody['email'] = inputs.email.value

        let response = await fetch(domain + '/user', {
            method: 'POST',
            cors: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        })

        let result = await response.json()
        if (result.status === 'FAILED') {
            // TODO:
            // Check for all the scenerarios and show proper
            // message
            alert.classList.add('alert-danger')
            alert.innerHTML = result.message
            $('.alert').show()
            setTimeout(() => {
                $('.alert').hide()
            }, 3000)
        } else {
            $(".left-section-1").fadeOut("slow", "swing", () => {
                $(".left-section-2").fadeIn("fast", "linear", () => {
                    $(".trigger").toggleClass("drawn")
                    // Prepare crypto profile - should include the email address,
                    // and the keypair - for now unencrypted.
                    // Chrome storage also needs to be created and the said profile to be stored
                    // and the secret key to be encrypted.
                    $('#setupMessage').html("<strong>Downloading shield account details...</strong>")
                    let shieldAccountDetails = {}
                    shieldAccountDetails['email'] = inputs.email.value
                    shieldAccountDetails['publicKey'] = inputs.publicKey.value
                    shieldAccountDetails['privateKey'] = inputs.privateKey.value
                    download('shieldAccount.txt', JSON.stringify(shieldAccountDetails))
                    setTimeout(() => {
                        $('#setupMessage').html("<strong>Creating Shield storage...</strong>")
                        chrome.storage.local.set({shieldAccount: {}}, () => {
                            shieldAccountDetails['password'] = inputs.password.value
                            chrome.runtime.sendMessage({query: 'addAccount', text: shieldAccountDetails}, (response) => {
                                // TODO:
                                // Upgrade Proposal: Allow users to download
                                // their Fabric membership certificate.
                                // $('#setupMessage').html("<strong>Downloading certificate...</strong>")
                                setTimeout(() => {
                                    $('#setupMessage').html("<strong>Done. Please remember to verify your email. Tab will close in 10 seconds.</strong>")
                                    setTimeout(() => {
                                        window.close()
                                    }, 10000)
                                }, 3000)
                            })
                        })
                    }, 5000)
                })
            })
        }
    })
}