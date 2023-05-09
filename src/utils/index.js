const crypto = require('crypto');
const dotenv = require('dotenv');
const User = require('../model/user');
dotenv.config()
const genHash =  (data) => {
    
    const salt = crypto.randomBytes(32).toString('hex').concat(process.env.appSecret);
    const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return {salt, hash}
}

const validateHash = (hash,salt, data) => {
    const originalHash = hash;
    const newHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return newHash === originalHash;
}

const genAppAccessToken =  ()=>{
    const userKey = crypto.randomBytes(32).toString('hex');
    return  crypto.pbkdf2Sync(userKey, process.env.appSecret, 10000, 64, 'sha512').toString('hex');
}

const verifyAppAccessToken = async (token,userAppKey) => {
   
    return token === crypto.pbkdf2Sync(userAppKey, process.env.appSecret, 10000, 64, 'sha512').toString('hex');

}




module.exports = {genHash, validateHash,genAppAccessToken,verifyAppAccessToken}