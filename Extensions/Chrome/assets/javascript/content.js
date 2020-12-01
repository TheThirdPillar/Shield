chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response = {}

    if (request.query == 'userPassword') {
        swal({
            title: "Authenticate Action ?",
            text: "Enter password to authenticate.",
            icon: "info",
            closeOnClickOutside: false,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your password",
                    type: "password"
                }
            },
            buttons: ["Nope", "Confirm"],
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            }
        })
        .then((password) => {
            if (password) {
                response['status'] = "SUCCESS"
                response['password'] = password
                sendResponse(response)
            } else {
                response['status'] = "DECLINED"
                sendResponse(response)
            }
        })
    }

    return true
})