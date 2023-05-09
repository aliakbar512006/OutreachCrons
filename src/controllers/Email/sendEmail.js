const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2Client } = google.auth;

const sendMail = async ({ from, to, message, authUser }) => {
  try {
    // Load the user's access token and refresh token from the database
    const accessToken = 'user-access-token';
    const refreshToken = 'user-refresh-token';

    // Create an OAuth2Client instance with the stored credentials
    const oAuth2Client = new OAuth2Client(
      'your-client-id',
      'your-client-secret',
      'your-redirect-uri'
    );

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Create a Nodemailer transport using the Gmail API
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'user-email-address',
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    // Set up the email message
    const mailOptions = {
      from: from,
      to: to,
      subject: message.subject,
      text: message.text,
      html: message?.html,
    };

    // Send the email using Nodemailer
    const info = await transport.sendMail(mailOptions);

    console.log(`Email sent. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendMail;
