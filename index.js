const sgMail = require('@sendgrid/mail');
const BoxSDK = require('box-node-sdk');
const dateFormat = require('dateformat');
const BoxConfig = require('config').boxAppSettings;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
    or access the it in the <a href='https://box-platform-standard.herokuapp.com/'>Westpac Portal</a><br><br>

    Lorem ipsum dolor sit amet, justo dictum duis phasellus sodales non eget,
    donec tincidunt nunc erat sit dui ullamcorper, dictum volutpat vivamus, nulla
    mauris proin mi suspendisse odio, turpis facilisis. Risus morbi, donec neque
    ante erat faucibus maecenas nulla, enim non erat parturient veniam sit. Arcu
    posuere dictumst, nascetur dui eu, interdum nostra, at torquent eros neque,
    felis lorem purus aliquam.<br><br>

    Thank you<br><br>
    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Westpac_logo.svg/2000px-Westpac_logo.svg.png' height='42'>
    </body>`;

  let msg = {
    to: 'mmitchell+westpac@box.com',
    from: 'sendgrid@test.com',
    subject: 'New Document(s) Available - ' + now,
    html: html,
  };

  sgMail.send(msg);
  console.log("Email sent");
}
