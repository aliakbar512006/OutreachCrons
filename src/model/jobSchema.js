const moment = require('moment');
const mongoose = require('mongoose');
const trackingId = `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;

const stage = new mongoose.Schema({
  condition:{
    type: String,
    enum: ["No Reply", "No Open", "No Click", "Everyone"],
    default: 'Everyone'
  },
  sendType:{
    type: String,
    enum: ['plain text','rich text'],
    default: 'plain text'
  },
  duration:{
    type: String,
  },
  message:{
    type: String,
  }
})

const tracking = new mongoose.Schema({
  isOpened:{
    type: Boolean,
    default: false
  },
  isClicked:{
    type: Boolean,
    default: false
  },
})

const speed = new mongoose.Schema({
  mailsPerDay:{
    type: String,
    required: true
  },
  delay:{
    type: String,
    required: true
  }
})


const schedule = new mongoose.Schema({
  start:{
    type: String,
    required: true
  },
  end:{
    type:String,
    required: true
  },
  timezone:{
    type: String,
    required: true
  },
  days:{
    type: [String],
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true
  },
  speed:{
    type:speed,
    required: true
  },
  repeat:{
    type: String,
    required: true
  }
})

const jobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  emailList: {
    type: [String],
    required: true,
  },
  tracking: {
    type: tracking,
    required: true
  },
  action: {
    type: String,
    enum: ['send','draft'],
    default: "draft",
    required: true
  },
  autofollowup: {
    type: [stage]
  },
  schedule: {
    type: schedule,
    required: true
  },
  interval: {
    type: String,
    required: true
  },
  email: Array,
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  lastRun: {
    type: Date,
  },
  nextRun: {
    type: Date,
    required: true,
  },
  trackingId: {
    type: String,
  },
  trackingLink: {
    type: String,
  },
  trackmail: {
    type: Array,
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
