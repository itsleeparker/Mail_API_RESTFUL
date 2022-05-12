const nodemailer = require('nodemailer');

const sendMail = (sender , rec , sub , message)=>{
 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PWD}`
    }
  });

  var mailOptions = {
    from: sender,
    to: rec,
    subject: sub,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      //Write a feature to send the sender to send the error message here
    } else {
      console.log('Email sent: ' + info.response);
    }
 });
}

module.exports=  {
  mailer : sendMail
}