const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
function sendMail(recepient, text, message, url) {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: 'alverta.carter12@ethereal.email',
			pass: 'DnyjNGnP4eaZqtsXks',
		},
	});

	// send mail with defined transport object
	transporter
		.sendMail({
			from: 'iSupport team', // sender address
			to: recepient, // list of receivers
			subject: 'Email confirmation', // Subject line
			text: text, // plain text body
			html: `<div>
                    <h1>Welcom to our website<h1>
                    <h2>iSupport team<h2>
                    <div>
                    <p><b>${message}</b></p>
                    <a href=${url}>${url}</a>
                    </div>
                </div>`, // html body
		})
		.then((info) => {
			console.log('Message sent: %s', info.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			return 'Preview URL: %s', nodemailer.getTestMessageUrl(info);
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		})
		.catch((error) => console.log(error));
}

module.exports = { sendMail };
