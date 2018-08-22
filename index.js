const sgMail = require('@sendgrid/mail');
const BoxSDK = require('box-node-sdk');
const dateFormat = require('dateformat');

const BoxConfig = require('config').boxAppSettings;
const SendgridApiKey = require('config').sendgridApiKey
// Plug in your own email. note: these email might land in your spam folder
const targetEmail ='mmitchell+demo@box.com';

// configure Sendgrid API client
sgMail.setApiKey(SendgridApiKey);

// instatiate Box SDK object / API client
const BoxSdk = new BoxSDK({
	clientID: BoxConfig.clientID,
	clientSecret: BoxConfig.clientSecret,
	appAuth: {
		keyID: BoxConfig.appAuth.publicKeyID,
		privateKey: BoxConfig.appAuth.privateKey,
		passphrase: BoxConfig.appAuth.passphrase
	}
});
const client = BoxSdk.getAppAuthClient('enterprise', BoxConfig.enterpriseID);

// Catch Box Webhook, handle event
exports.handler = (event, context, callback) => {
  let webhookEvent = JSON.parse(event.body);
  console.log("Received upload event from Box!");
  console.log(webhookEvent);

  processMessage(webhookEvent)

  callback(null, {statusCode: 200, body: 'success'})
};

async function processMessage(webhookEvent) {
  let link = await client.files.update(webhookEvent.source.id, {shared_link: client.accessLevels.DEFAULT})
  let now = new Date();
  now = dateFormat(now, "mm/dd/yyyy, h:MM TT");
  let html = `<body style='font-family: Lato, sans-serif'>
    Hello,<br><br>

    A new document, <strong>${webhookEvent.source.name}</strong>,
    has been shared with you!<br> Preview the document <a href='${link.shared_link.url}'>here</a>
    or access the it in our <a href='https://box-platform-standard.herokuapp.com/'>customer portal</a><br><br>

    Lorem ipsum dolor sit amet, justo dictum duis phasellus sodales non eget,
    donec tincidunt nunc erat sit dui ullamcorper, dictum volutpat vivamus, nulla
    mauris proin mi suspendisse odio, turpis facilisis. Risus morbi, donec neque
    ante erat faucibus maecenas nulla, enim non erat parturient veniam sit. Arcu
    posuere dictumst, nascetur dui eu, interdum nostra, at torquent eros neque,
    felis lorem purus aliquam.<br><br>

    Thank you<br><br>
    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Acme_Markets_lolo.svg/2000px-Acme_Markets_lolo.svg.png' height='42'>
    </body>`;

  let msg = {
    to: targetEmail,
    from: 'sendgrid@test.com',
    subject: 'New Document(s) Available - ' + now,
    html: html,
  };

  sgMail.send(msg);
  console.log("Email sent");
}
