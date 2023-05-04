const mongoose = require('mongoose');
const Campaign = require('./campaign');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
    },
    googleId:{
        type: String,
    },
    picture:{
        type: String,
    },
    campaign:{
        type: [Campaign],
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;