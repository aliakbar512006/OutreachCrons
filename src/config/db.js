const mongoose = require('mongoose')

const Db = mongoose.connect("mongodb://localhost:27017/theOutreach", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
 );

 module.exports = Db


