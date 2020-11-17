document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.local.get(['shieldAccount'], (account) => {
        if (account) {
            let qrText = account.shieldAccount.publicKey
            let totalApplications = account.shieldAccount.shieldDB.length
            let activeSessions = account.shieldAccount.sessions.length
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: qrText,
                width: 128,
                height: 128,
                colorDark : "#E03A3F",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            document.getElementById('totalApplications').innerHTML = totalApplications.toString()
            document.getElementById('activeSessions').innerHTML = activeSessions.toString()
        }
    })
})

// document.getElementById("downloadDataButton").addEventListener("click", () => {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//             if (chrome.runtime.lastError) {
//                 console.log(chrome.runtime.lastError);
//             }
//             console.log(response)
//         });
//     })
// })