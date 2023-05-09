const cron = require('node-cron');
const Job = require('../../model/jobSchema');
const sendEmail = require('../../utils/sendEmail');
const moment = require('moment');

// Run the job every minute for testing purposes
cron.schedule('* * * * *', async () => {
   
  // Find all jobs that are due to run
  const now = moment();
  const jobs = await Job.find({ nextRun: { $lte: now } }).populate('userId');
  console.log("all jobs",jobs);

  // Loop through each job and execute it
  for (const job of jobs) {

    try {
      // Send the email using the user's authentication tokens
      await sendEmail({
        from: job.userId.email,
        messageId: job._id,
        to: job.email,
        subject: job.subject,
        message: job.message,
        trackingEndpoint: process.env.TRACKING_ENDPOINT,
        accessToken: job.userId.accessToken,
        refreshToken: job.userId.refreshToken,
      });

      // Update the last run time and calculate the next run time
      const char = job.interval.split('$');
     
      const nextRunTime = moment(Date.now()).add(Number(char[0]), char[1]).format();
      console.log("next run",nextRunTime)
        job.lastRun = now;
      job.nextRun = nextRunTime;
      await job.save();
    } catch (error) {
      console.error(`Error sending email for job ${job._id}: ${error}`);
    }
  }
});

module.exports.cron = cron;

