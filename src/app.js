const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require ('cors');
const Db = require('./config/db');



const app = express();

Db.then(
  () => console.log('Db Connected'),
  err => console.log(err)
)


app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
module.exports = app;
