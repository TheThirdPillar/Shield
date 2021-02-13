'use strict';
// Send Grid module to send verification email
const sgMail = require('@sendgrid/mail')
var sendgrid_API_KEY = require('../../config/sendgrid')

// Set API KEY
sgMail.setApiKey(sendgrid_API_KEY.APIKey)

exports.sendMail = function(sendTo, verificationCode) {

    let url = "https://api.skillschain.org/users/verify?code=" + verificationCode

    const message = {
        to: sendTo,
        from: 'no-reply@skillschain.org',
        subject: 'SkillsChain Email Verification',
        text: 'OTP to verify the validity of the email',
        html: `

        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>SkillsChain - Email verification</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                html, body {
                    float: left;
                    width: 100%;
                    height: 100%;
                    left: 0px;
                    right: 0px;
                    margin: 0px;
                    padding: 0px;
                    background: #ffffff;
                    font-family: 'Poppins', sans-serif !important;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    font-style: normal;
                }
                .emailer_container {
                    width: 600px;
                    margin: 0px auto;
                    display: block;
                    background-color: rgba(244, 244, 244, 1);
                    height: 600px;
                }
                .full_width {
                    width: 100%;
                    float: left;
                }
                .test {
                    left: 190px;
                    top: 53px;
                    width: 721px;
                    height: 997px;
                    line-height: 20px;
                    opacity: 0.28;
                    border-radius: 12px;
                    background-color: rgba(244, 244, 244, 1);
                    text-align: center;
                    border: 1px solid rgba(187, 187, 187, 1);

                }
                .logo {
                    width: 260px;
                    margin: 40px auto 0px;
                    display: block;
                }
                .email_check_bg {
                    width: 118px;
                    margin: 40px auto 0px;
                    display: block;
                }
                .email_title {
                    float: left;
                    width: 100%;
                    text-align: center;
                    font-size: 24px;
                    line-height: 30px;
                    color: #424242;
                    position: relative;
                }
                .email_info {
                    float: left;
                    width: 100%;
                    text-align: center;
                    font-size: 18px;
                    line-height: 24px;
                    color: #424242;
                    margin-top: 4px;
                    box-sizing: border-box;
                    padding: 0px 82px;
                }
                .email_box {
                    line-height: 28px;
                    opacity: 0.77;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid rgba(187, 187, 187, 1);
                    font-size: 28px;
                    color: rgba(16, 16, 16, 1);
                    font-size: 28px;
                    width: 400px;
                    margin: 0px auto;
                    display: grid;
                    height: auto;
                    background: #ffffff;
                }
                .email_title::after {
                    content: "";
                    display: block;
                    width: 85px;
                    background-color: rgba(111, 18, 207, 1);
                    height: 4px;
                    border-radius: 2px;
                    margin: 5px auto;
                }
                .horizontal_line {
                    height: 4px;
                    width: 85px;
                    background-color: rgba(111, 18, 207, 1);
                    margin: 60px auto 10px;
                    display: block;
                    border-radius: 2px;
                }
            </style>
        </head>
        <body>
            <div class="emailer_container">
                <div class="full_width">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/ef29f36c092118aa/f0bb3b59-82b7-4f62-b481-409eb256f972/311x44.png" style="width:100%;margin-top:20px;margin-bottom:50px;">
                    <img class="email_check_bg" src="https://i.ibb.co/CQ1tnXW/email-bg.png">
                    <p class="email_title">Verify your Email</p>
                    <div class="horizontal_line"></div>
                    <p class="email_info">Greetings from the team. Looks like you're just a couple of steps away. Please click on the link below to verify your account.
                    <div class="email_box">
                        <a href=${url}>Verify with Shield</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `
    }
    sgMail
    .send(message)
    .then(() => {}, error => {
        console.error(error)
        if (error.response) {
            console.error(error.response.body)
        }
    })
}