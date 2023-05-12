const cron = require('node-cron');
const Job = require('../../model/jobSchema');
const sendEmail = require('../../utils/sendEmail');
const moment = require('moment');
const {generateTrackingLink} = require('../../utils');

// Run the job every minute for testing purposes
cron.schedule('* * * * *', async () => {
   
  // Find all jobs that are due to run
  const now = moment();
  const jobs = await Job.find({ nextRun: { $lte: now } }).populate('userId');
  console.log("all jobs",jobs);

  // Loop through each job and execute it
  for (const job of jobs) {
    try {
      // Send the email 
      const sendEmailsWithTrackingLinks = async (emails) => {  
        const promises = emails?.map(async (email) => {
          const trackingLink = await generateTrackingLink({email, messageId: job._id,
            scheduleId: job._id,trackingId:job.trackingId});
         return  await sendEmail({
            from: job.userId.email,
            messageId: job._id,
            scheduleId: job.trackingId,
            to: email,
            subject: job.subject,
            message: job.message,
            accessToken: job.userId.accessToken,
            refreshToken: job.userId.refreshToken,
            labelIds: job.labelIds,
            trackingLink
          });       
        
        });
      
        const results = await Promise.all(promises);
        console.log(`Sent ${emails.length} emails with tracking links`);
        return results;
      };
      
      
      const output = await  sendEmailsWithTrackingLinks(job.email);
      // Update the last run time and calculate the next run time
      console.log("output",output)
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

