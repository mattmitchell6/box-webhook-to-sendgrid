# Box Webhook to Sendgrid
Use Box webhooks to attach event triggers to Box file/folder actions. Configure webhook to send Box events to AWS lambda and send custom email via Sendgrid.

### Set up Instructions (very rough)
1. Change name of 'local.sample.js' file to 'local.js'
2. Create Box JWT app, generate keys/credentials, update credentials in the local.js file
3. Create a Sendgrid app, generate key, and add key to local.js file.
4. Generate AWS Lambda
5. Update 'targetFolderId' (Box folder you'd like to set the webhook on, must be a folder ID that the app's service account has access to) and 'notificationUrl' (AWS API Gateway 'API endpoint' url) variables in the create-webhook.js file
6. Update 'targetEmail' variable in the index.js file to your desired target email.
7. Install npm packages
```bash
$ npm install
```
8. Create Box webhook by running the command:
```bash
$ npm run create-webhook
```
9. Zip the project by running
```bash
$ npm run zip
```
10. Deploy to AWS (must have aws cli installed)
```bash
$ npm run deploy
```
11. Test it out! Upload file to target folder and receive email notification (assuming you did everything correctly :))
