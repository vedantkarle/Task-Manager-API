const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'vedant@sshell.in',
        subject:'Welcome to task-manager by vedant karle',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app!`
    })
}

const sendCancelationEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'vedant@sshell.in',
        subject:'We are curious to know why u quit our app!!',
        text:`${name}. Let me know why you quit our app!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}