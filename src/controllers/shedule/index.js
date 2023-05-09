const { time } = require('cron');
const Job = require('../../model/jobSchema');
const moment = require('moment');

const create  = async (req,res) => {
    try {
       
        const { userId, interval, email, subject, message, lastRun, nextRun } = req.body;
        const char = interval.split('$');
        const current =  moment(Date.now()).add(Number(char[0]),`${char[1]}`).format()
        console.log(current)
        const job = {
            userId,
            interval,
            email,
            subject,
            message,
            lastRun,
            nextRun:current

        }
      
        const newSchedule = await Job.create(job);
     res.status(201).json(newSchedule);
    } catch (error) {
        console.log(error)
    }

};


const trackmail = async (req,res) => {
    try{
        console.log(req.query)
    }catch(error){
        console.log(error)
    }

}

module.exports = { create ,trackmail};