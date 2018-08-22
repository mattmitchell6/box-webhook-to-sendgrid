const BoxSDK = require('box-node-sdk');
require('dotenv').config()
var dateFormat = require('dateformat');
var now = new Date();;

const BoxConfig = require('config').boxAppSettings;

const BoxSdk = new BoxSDK({
	clientID: BoxConfig.clientID,
	clientSecret: BoxConfig.clientSecret,
	appAuth: {
		keyID: BoxConfig.appAuth.publicKeyID,
		privateKey: BoxConfig.appAuth.privateKey,
		passphrase: BoxConfig.appAuth.passphrase
	}
});

let link = createSharedLink('312032568998')
console.log(link);

async function createSharedLink(id) {
	let client = BoxSdk.getAppAuthClient('enterprise', process.env.ENTERPRISE_ID);

  let link = await client.files.update(id, {shared_link: client.accessLevels.DEFAULT})
	console.log(link.shared_link.url);

  return link.shared_link.url;
}

// now = dateFormat(now, "mm/dd/yyyy, h:MM TT");
// console.log(now);
