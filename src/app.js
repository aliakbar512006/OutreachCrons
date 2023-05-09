const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require ('cors');
const Db = require('./config/db');

// ::::::::::::: Database ::::::::::::::::::::

Db.then(
  () => console.log('Db Connected'),
  err => console.log(err)
)


const app = express();


// ::::::::::::: Middlewares ::::::::::::::::::::
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 // enable cors
// ::::::::::::::End of Middlewares::::::::::::::

// ::::::::::::: Controllers ::::::::::::::::::::
const { googleOathConroller } = require('./controllers/auth/googleOauth2/googleOuath');
// ::::::::::::::End of Controllers::::::::::::::

// ::::::::::::: Routes ::::::::::::::::::::
const scheduleRoute = require('./routes/sheduleRoute');
const { cron } = require('./service/email/cron');
// ::::::::::::::End of Routes::::::::::::::


// ::::::::::::::End of Database::::::::::::::

// initailize google oath controller
googleOathConroller(app)
app.use('/schedule', scheduleRoute);
app.get('/trackmail/*',(req,res)=>{
  console.log(req.query)
  res.status(200).sendFile(path.join(__dirname,'public','trackmail.gif'))
}
)
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
module.exports = app;
