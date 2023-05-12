const { time } = require('cron');
const Job = require('../../model/jobSchema');
const moment = require('moment');
const JobValidator = require('../../utils/validation');
const { convertToTimezone } = require('../../utils');
const { lte } = require('lodash');

const create  = async (req,res) => {
    try {
       
        // const {interval, email, subject, message, lastRun, nextRun } = req.body;
        const {error, value} =  JobValidator(req.body);
        const id = req.user.userAppKey
        if(error){
            return res.status(400).json({message:error.message})
        }
        const char = value.interval.split('$');
        const current =  moment(Date.now()).add(Number(char[0]),`${char[1]}`).format()

        let start = await convertToTimezone(value.schedule.start, value.schedule.timezone)
       
        let end = await convertToTimezone(value.schedule.end, value.schedule.timezone)
    
        const job = {
            ...value,
            userId:id,
            emailList: value.emailList,
            tracking: value.tracking,
            action: value.action,
            autofollowup: value.autofollowup,
            schedule: {
                start: start,
                end:end,
                timezone: value.schedule.timezone,
                days: value.schedule.days,
                speed:{
                    mailsPerDay:value.schedule.speed.mailsPerDay,
                    delay:value.schedule.speed.delay
                },
                repeat: value.schedule.repeat
            },
            nextRun:current,
            interval: value.interval,
        }
      
        const newSchedule = await Job.create(job);
     return res.status(201).json(newSchedule);
    } catch (error) {
        console.log(error)
    }

};


module.exports = { create};