const auth = require('./auth');
const User = require('../../../model/user');
const moment  = require('moment');
const { genAppAccessToken } = require('../../../utils');
const config = require('../../../config');
const dotenv = require('dotenv')
dotenv.config()

const googleOathConroller = (app) => {
  
  app.get('/', (req, res) => {
    res.status(200).json({ code: 200, message: 'checked' });
  });

  app.get('/auth/google', (req, res) => {
    const authUrl = auth.getAuthUrl();//    
    res.redirect(authUrl);
  });

  app.get('/0auth2/callback', async (req, res) => {
    try {
     
      const { code } = req.query;
      const token = await auth.getAllTokens(code);
      const googlUser = await auth.getUserData(token.id_token);
  
      // check if user exist
      const existUser =  await User.findOne({ googleId: googlUser.sub })
      if(!existUser){
        // create new user
        const userAppKey = await genAppAccessToken()
        console.log(userAppKey)
        const newUser =  await User.create({
          userAppKey:userAppKey,
          name: googlUser.name,
          email: googlUser.email,
          googleId: googlUser.sub,
          picture: googlUser.picture,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          tokenExpire: token.expiry_date
        })
        return res.redirect(`${config.FRONTEND_URL}/social/?token=${userAppKey}`);
      }else {
        if(existUser.tokenExpire <= moment().subtract(3, 'days')){
          //get new token from refresh token
          const newToken = await auth.getNewToken(existUser.refreshToken);
          await User.updateOne({ googleId: existUser.sub }, {
            tokenExpire: newToken.expiry_date,
            accessToken: newToken.access_token,
            refreshToken: newToken.refresh_token
          })
          return res.redirect(`${config.FRONTEND_URL}/social/?token=${existUser.userAppKey}`);
        }else {
          return res.redirect(`${config.FRONTEND_URL}/social/?token=${existUser.userAppKey}`);
        }

      }

    } catch (error) {  
      console.log(error)
      // return res.redirect(`${config.FRONTEND_URL}`);
    }
   
  });

  app.get('/new_token/:refeshToken', async (req, res) => {
    try {
      const { refeshToken } = req.params;
      const token = await auth.getNewToken(refeshToken);
      res.status(200).json({
        message: 'refreshed successful',
        token: token
      });
    } catch (error) {
      return res.status(400).json({ code: '400', message: 'Bad Request' });
    }
  });
};

module.exports = {
  googleOathConroller
};
