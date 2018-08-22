const BoxSDK = require('box-node-sdk');
const BoxConfig = require('config').boxAppSettings;

const targetFolderId = "<target-folder-id-here>";
const notificationUrl = "https://testurl.com/webhook";

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

// create webhook
client.webhooks.create(
	targetFolderId,
	client.itemTypes.FOLDER,
	notificationUrl,
	[ client.webhooks.triggerTypes.FILE.UPLOADED])
	.then(webhook => {
    console.log(webhook);
  })
  .catch(error => {
    console.log(error);
  })

// for deleting temp webhooks
// client.webhooks.delete('82189037')
//   .then(() => {
//
//   })
//   .catch(error => {
//     console.log(error);
//   });
