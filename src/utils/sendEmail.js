const { google } = require('googleapis');
const config = require('../config');
const sendMail = async ({ from, to, subject, message, accessToken, refreshToken, labelIds, scheduleId,messageId,trackingLink}) => {
  try {

    // Create an OAuth2 client with the stored credentials
    const oAuth2Client = new google.auth.OAuth2(
      config.client_id,
      config.client_secret,
      config.redirect_uri
    );

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    // Use the Gmail API to send the email
    const gmail = google.gmail({
      version: 'v1',
      auth: oAuth2Client
    });


    // const emailId = encryptEmail(userAppKey,config.appSecret); 

    const messageParts = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 7bit`,
      `X-No-Cache: ${messageId}`, // Use the emailId as the X-No-Cache header value
      `X-Schedule-Id: ${scheduleId}`, // Add the scheduleId as a custom header
      `X-Message-Id: ${messageId}`, // Add the messge as a custom header
      `X-User-Email: ${to}`, // Add the email of user as a custom header
      '',
      `<html><body><img src="${trackingLink}"width="1" xlink=${trackingLink} height="1">${message}</body></html>`
    ];

    const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64');
    const messageToSend = {
      raw: encodedMessage,
      labelIds: labelIds || [] // Optionally set labelIds
    };

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: messageToSend
    });
    console.log(`Email sent to ${to}`);
    return result;
  } catch (error) {
    console.error(error);
  }
};



module.exports = sendMail;


