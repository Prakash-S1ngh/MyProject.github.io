const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
});

exports.mailsending = async(email,message)=>{
    try {
        console.log("The mail is been prepared ", email);
        const mail = await transporter.sendMail({
            from:"my EdtechProject",
            to:email,
            subject:"Congratulations on signin up for learning",
            html:message
        });
        console.log("An email is sent to ", email);
    } catch (error) {
        console.log("An error occured during the email sending please wait",error);
        process.exit(1);
    }
}