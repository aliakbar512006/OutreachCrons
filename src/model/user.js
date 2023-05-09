const mongoose = require('mongoose');
const {campaignSchema} = require('./campaign');

const userSchema = new mongoose.Schema({
    userAppKey:{
        type: String,
        required: true,
    } ,
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

    accessToken:{
        type: String,

    },
    refreshToken:{
        type: String,
    },
    tokenExpire:{
        type: Number,
    },

    picture:{
        type: String,
    },
    campaign:{
        type: [campaignSchema],
        default: []
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;