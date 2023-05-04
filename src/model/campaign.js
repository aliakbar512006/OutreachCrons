// models/campaign.js

const mongoose = require('mongoose');

const stage = new mongoose.Schema({
  condition:{
    type: String,
    enum: ['not opened','not clicked','not replied','everyone'],
    default: 'everyone'
  },
  sendType:{
    type: String,
    enum: ['same-thread','original'],
    default: 'original'
  },
  duration:{
    type: Date,
  },
  message:{
    type: String,
  }
})

const speed = new mongoose.Schema({
  mailsPerDay:{
    type: Number,
    required: true
  },
  delay:{
    type: Number,
    required: true
  }
})

const schedule = new mongoose.Schema({
  start:{
    type: Date,
    required: true
  },
  end:{
    type: Date,
    required: true
  },
  timezone:{
    type: Date,
    required: true
  },
  days:{
    type: string,
    enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    required: true
  },
  speed:{
    type:speed,
    required: true
  },
  repeat:{
    type: number
  }
})


const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
  },
  googleId:{
    type: String,
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  emailList: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'scheduled'],
    default: 'draft'
  },
  tracking: {
    type: String,
    enum: ['opens','clicks'],
    default: null
  },
  autofollowup: {
    type: [stage]
  },
  action: {
    type: String,
    enum: ['sendEmail','draft'],
    default: draft
  },

  scheduledTime: {
    type: Date
  },
  sentTime: {
    type: Date
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
