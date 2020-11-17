chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response = {}

    if (request.query == 'userPassword') {
        swal({
            title: "Application Login",
            text: "Allow application to login ?",
            icon: "info",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your password",
                    type: "password"
                }
            },
            buttons: ["Nope", "Confirm"]
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