
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const { OAuth2Client } = require('google-auth-library'); // add this line

const credentials = require('../../../../credential.json');

const oauth2Client = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

const SCOPES = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
];

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
}

async function getAllTokens(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}

async function getUserData(idToken) {

  try {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    
    // 
  
    // decode the ID token
    const client = new OAuth2Client(credentials.web.client_id);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: credentials.web.client_id,
    });
    return ticket.getPayload();
  
  } catch (error) {
    return null

  }
 
}

async function getNewToken(refreshToken) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  
  return new Promise((resolve, reject) => {
    oauth2Client.refreshAccessToken((err, tokens) => {
      if (err) return reject(err);
      resolve(tokens);
    });
  });
}

module.exports = { getAuthUrl, getAllTokens, getUserData, getNewToken, oauth2Client };


