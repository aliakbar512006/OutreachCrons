const crypto = require('crypto');
const dotenv = require('dotenv');
const axios = require('axios');
const config = require('../config');
const moment = require('moment');
const os = require('os');

dotenv.config()
const genHash =  (data) => {
    
    const salt = crypto.randomBytes(32).toString('hex').concat(config.appSecret);
    const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return {salt, hash}
}

const validateHash = (hash, salt, data) => {
    const originalHash = hash;
    const newHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return newHash === originalHash;
}

const genAppAccessToken = async ()=>{
    const userKey = crypto.randomBytes(32).toString('hex');
    return  crypto.pbkdf2Sync(userKey, config.appSecret, 10000, 64, 'sha512').toString('hex');
}

const verifyAppAccessToken = async (token,userAppKey) => {
   
    return token === crypto.pbkdf2Sync(userAppKey, config.appSecret, 10000, 64, 'sha512').toString('hex');

}


function encryptEmail(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decryptEmail(data, key) {
  const [ivHex, encryptedHex] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


const generateTrackingLink = async ({email,messageId,scheduleId,trackingId}) => {
    return `${config.TRACKING_URL}/?trackingId=${trackingId}&email=${email}&scheduleId=${scheduleId}&messageId=${messageId}&no_proxy=1`;
  };



const getGeolocationInfo = async (ipAddress) => {
  try {
    const response = await axios.get(`https://get.geojs.io/v1/ip/geo/${ipAddress}.json`);
    return response.data;
   
  } catch (error) {
    console.error(error);
    return {}
  }
};

async function convertToTimezone(date, timeZone) {

const userLocale = process.env.LANG || os.env.LANG;
let locale = userLocale.split(".")[0]
locale = locale.split('_').join('-')

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  };

  if (typeof date === 'string') {
    return new Date(
      new Date(date).toLocaleString(`${locale}` , options),
    )
  }

  return new Date(
    date.toLocaleString(`${locale}`, options)
  )
}








module.exports = {genHash, getGeolocationInfo, validateHash,genAppAccessToken,verifyAppAccessToken,encryptEmail,decryptEmail,generateTrackingLink, convertToTimezone}
