const nodemailer = require('nodemailer');

const mail = {
    user: 'info@distribuidora-ringo.com.ar',
    pass: 'micontraseña'
}

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "68368d667578e9",
      pass: "0fe90ebe1a866f"
    }
}); 

  const sendEmail = async (email, subject, html) => {
    try {
        
        await transport.sendMail({
            from: `MHCode <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Hola amigos, suscríbance para más videos", // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  const getTemplate = (name, token) => {
      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${ name }</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:4000/api/user/confirm/${ token }"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
  }

  module.exports = {
    sendEmail,
    getTemplate
  }