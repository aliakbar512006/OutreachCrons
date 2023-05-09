const { google } = require('googleapis');
// // const nodemailer = require('nodemailer');

// // const sendMail = async ({ from, to, subject, message, accessToken, refreshToken }) => {
// //   try {
// //     // Create an OAuth2 client with the stored credentials
// //     const oAuth2Client = new google.auth.OAuth2(
// //       process.env.client_id,
// //       process.env.client_secret,
// //       process.env.redirect_uri
// //     );

// //     oAuth2Client.setCredentials({
// //       access_token: accessToken,
// //       refresh_token: refreshToken
// //     });

// //     // Use the Gmail API to send the email
// //     const gmail = google.gmail({
// //       version: 'v1',
// //       auth: oAuth2Client
// //     });

// //     const messageParts = [
// //       'From: ' + from,
// //       'To: ' + to,
// //       'Subject: ' + subject,
// //       '',
// //       message
// //     ];

// //     const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64');
// //     const messageToSend = {
// //       raw: encodedMessage
// //     };

// //     const result  = await gmail.users.messages.send({
// //       userId: 'me',
// //       requestBody: messageToSend
// //     });
// //     console.log(`Email sent to ${to}`);
// //     return result
// //   } catch (error) {
// //     console.error(error);
// //   }
// // };

// // module.exports = sendMail;



// const { google } = require('googleapis');
// const nodemailer = require('nodemailer');

// const sendMail = async ({ from, to, subject, message, accessToken, refreshToken }) => {
//   try {
//     // Create an OAuth2 client with the stored credentials
//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.client_id,
//       process.env.client_secret,
//       process.env.redirect_uri
//     );

//     oAuth2Client.setCredentials({
//       access_token: accessToken,
//       refresh_token: refreshToken
//     });

//     // Use the Gmail API to send the email
//     const gmail = google.gmail({
//       version: 'v1',
//       auth: oAuth2Client
//     });

//     // Add tracking pixel to message body
//     const trackingPixel = '<img src="https://yourdomain.com/tracking.gif" alt="" width="1" height="1" border="0" />';
//     message += trackingPixel;

//     const messageParts = [
//       'From: ' + from,
//       'To: ' + to,
//       'Subject: ' + subject,
//       'MIME-Version: 1.0',
//       'Content-Type: text/html',
//       '',
//       message
//     ];

//     const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64');
//     const messageToSend = {
//       raw: encodedMessage
//     };

//     const result  = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: messageToSend
//     });
//     console.log(`Email sent to ${to}`);
//     return result
//   } catch (error) {
//     console.error(error);
//   }
// };






// const sendMail = async ({ from, to, subject, message, messageId, accessToken, refreshToken, trackingEndpoint }) => {
//   try {
//     // Create an OAuth2 client with the stored credentials
//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.client_id,
//       process.env.client_secret,
//       process.env.redirect_uri
//     );

//     oAuth2Client.setCredentials({
//       access_token: accessToken,
//       refresh_token: refreshToken
//     });

//     // Use the Gmail API to send the email
//     const gmail = google.gmail({
//       version: 'v1',
//       auth: oAuth2Client
//     });

//     const trackingUrl = `${trackingEndpoint}?user=${to}&email=${encodeURIComponent(messageId)}`;

//     const messageParts = [
//       'From: ' + from,
//       'To: ' + to,
//       'Subject: ' + subject,
//       'MIME-Version: 1.0',
//       'Content-Type: multipart/mixed; boundary="boundary"',
//       '',
//       '--boundary',
//       'Content-Type: text/html; charset=UTF-8',
//       'Content-Transfer-Encoding: 7bit',
//       '',
//       message,
//       '',
//       '--boundary',
//       'Content-Type: image/gif',
//       'Content-Disposition: inline',
//       'Content-ID: <tracking>',
//       'Content-Transfer-Encoding: base64',
//       '',
//       await fetch(trackingUrl).then(response => response.buffer()).then(buffer => buffer.toString('base64')),
//       '',
//       '--boundary--'
//     ];

//     const encodedMessage = messageParts.join('\n').replace(/\n/g, '\r\n');
//     const messageToSend = {
//       raw: Buffer.from(encodedMessage).toString('base64')
//     };

//     const result  = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: messageToSend
//     });

//     console.log(`Email sent to ${to}`);
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

const sendMail = async ({ from, to, subject, message, accessToken, refreshToken }) => {
  try {
    // Create an OAuth2 client with the stored credentials
    const oAuth2Client = new google.auth.OAuth2(
      process.env.client_id,
      process.env.client_secret,
      process.env.redirect_uri
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

    // Generate a tracking pixel URL
    const trackingPixelUrl = process.env.trackingPixelUrl;

    // Append the tracking pixel to the end of the email body
    const messageBody = `${message}\n<img src="${trackingPixelUrl}" alt="" width="1" height="1" border="0" />`;

    const messageParts = [
      'From: ' + from,
      'To: ' + to,
      'Subject: ' + subject,
      '',
      messageBody
    ];

    const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64');
    const messageToSend = {
      raw: encodedMessage
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


module.exports = sendMail;


