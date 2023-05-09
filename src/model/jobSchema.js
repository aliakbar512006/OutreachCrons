const moment = require('moment');
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createAt: {
    type: Date,
    default: moment().format()
  },
  interval: {
    type: String,
    required: true
  },
  email: {
    type: Array,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  lastRun: {
    type: Date,
  },
  nextRun: {
    type: Date,
    required: true,
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
