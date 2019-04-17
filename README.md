# ringcentral-chatbot-voicemail-helper <!-- omit in toc -->

RingCentral Chatbot: Voicemail transcript and AI analysis bot powered by [ringcentral-chatbot-skill-voicemail-helper](https://github.com/zxdong262/ringcentral-chatbot-skill-voicemail-helper) and [RingCentral chatbot framework js](https://github.com/ringcentral/ringcentral-chatbot-js)

Support command: `about`, `help`, `monitor`, `unmonitor`, after user authurization, bot will watch for new voicemails of the user, and transcript any new voicemail, and do some analysis with Google API.

## Table of Contents <!-- omit in toc -->

- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Test](#test)
  - [Create the Apps](#create-the-apps)
    - [Server/Bot App](#serverbot-app)
    - [Web-based App](#web-based-app)
  - [After apps created, you can get app client id and secret, put them in `.env`](#after-apps-created-you-can-get-app-client-id-and-secret-put-them-in-env)
  - [Start the bot server](#start-the-bot-server)
- [deploy to aws lambda](#deploy-to-aws-lambda)

## Screenshots

![ ](https://github.com/zxdong262/ringcentral-chatbot-skill-voicemail-helper/raw/master/screenshots/monitor.png)
![ ](https://github.com/zxdong262/ringcentral-chatbot-skill-voicemail-helper/raw/master/screenshots/unmonitor.png)
![ ](https://github.com/zxdong262/ringcentral-chatbot-skill-voicemail-helper/raw/master/screenshots/analysis.png)

## Prerequisites

- nodejs/npm
- a Google API account with a saved Google credentials file, note that you can still run local demo to see how it works without Google account/credential, but with fake demo data, Set env in `.env`:

```env
## for Google Cloud API credential path
GOOGLE_APPLICATION_CREDENTIALS=path-to-google-credential.json
```

- Login to [developer.ringcentral.com](https://developer.ringcentral.com) and [create browser based app](#Web-based-App). Set env in `.env`:

```env
## ringcentral web-based app for rc user auth
RINGCENTRAL_CLIENT_ID=
RINGCENTRAL_CLIENT_SECRET=
```

- [Create bot app for bot](#ServerBot-App). Set env in `.env`:

```env
RINGCENTRAL_CHATBOT_CLIENT_ID=
RINGCENTRAL_CHATBOT_CLIENT_SECRET=
```

## Test

```bash
git clone git@github.com:zxdong262/ringcentral-chatbot-voicemail-helper.git
cd ringcentral-chatbot-voicemail-helper
npm i

## start proxy
npm run ngrok
## will get Forwarding  https://xxxx.ngrok.io -> localhost:3000

## create config file
cp .env.sample .env

```

### Create the Apps

Login to [developer.ringcentral.com](https://developer.ringcentral.com) and create two different apps using the parameters below.

#### Server/Bot App

- General Settings
  - Choose a name and description you prefer.
- App Type and Platform
  - **Application Type**: Public
  - **Platform Type**: `Server/Bot`
  - **Carrier**: *accept the default values*
- OAuth Settings
  - **Permissions Needed**: All of them (ReadContacts, ReadMessages, ReadPresence, Contacts, ReadAccounts, SMS, InternalMessages, ReadCallLog, ReadCallRecording, WebhookSubscriptions, Glip)
  - **OAuth Redirect URI**: Using your ngrok HTTPS URL from above, enter in the following value:
          `https://xxxx.ngrok.io/bot/oauth`

#### Web-based App

- General Settings
  - Choose a name and description you prefer. 
- App Type and Platform
  - **Application Type**: Public
  - **Platform Type:*- `Browser-based`
  - **Carrier**: *accept the default values*
- OAuth Settings
  - **Permissions Needed**: All of them (ReadContacts, ReadMessages, ReadPresence, Contacts, ReadAccounts, SMS, InternalMessages, ReadCallLog, ReadCallRecording, WebhookSubscriptions, Glip)
  - **OAuth Redirect URI**: Using your ngrok HTTPS URL from above, enter in the following value:
    `https://xxxx.ngrok.io/rc/oauth`

### After apps created, you can get app client id and secret, put them in `.env`

### Start the bot server

```bash
npm start
## server runs on http://localhost:3000

## init database
curl -X PUT -u admin:password https://<bot-server>/admin/setup-database
```

Then you can goto bot app's bot menu, add the bot, and login to [https://glip-app.devtest.ringcentral.com](https://glip-app.devtest.ringcentral.com) to talk to the bot, try `@bot monitor` and `@bot unmonitor` command.

## deploy to aws lambda

- Create config file from templates:

```bash
cp dist/.env.sample.yml dist/.env.yml
cp dist/serverless.sample.yml dist/serverless.yml
# then fill .env.yml with proper config
# RINGCENTRAL_CLIENT_ID:
# RINGCENTRAL_CLIENT_SECRET:
# RINGCENTRAL_CHATBOT_CLIENT_ID:
# RINGCENTRAL_CHATBOT_CLIENT_SECRET:
```

- Create RDS(postgres database), update security group to allow inbound traffic from 0.0.0.0/0
- Set `RINGCENTRAL_CHATBOT_DATABASE_CONNECTION_URI` to `postgresql://username:userpassword@name.crgcakut24yg.us-east-1.rds.amazonaws.com:5432/dbname` in `.env.yml`.
- Build and deploy by `npm run build && npm run deploy`(This only support linux), will get the entrypoint url:

```bash
endpoints:
  ANY - https://xxx.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
```

Then set `RINGCENTRAL_CHATBOT_SERVER` to `https://xxx.execute-api.us-east-1.amazonaws.com/prod` in `.env.yml`.

And run `npm run deploy` again.

- In RingCentral developer site, set Bot app's redirect URL to `https://xxx.execute-api.us-east-1.amazonaws.com/prod/bot/oauth`
- In RingCentral developer site, set Web-based App's redirect URL to `https://xxx.execute-api.us-east-1.amazonaws.com/prod/rc/oauth`
- Try adding the bot and talk to the bot.

