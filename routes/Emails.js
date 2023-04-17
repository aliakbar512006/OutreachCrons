const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const nodemailer = require('nodemailer');

router.use((req, res, next) => {
    const headers = req.headers;
    const clientToken = headers['authorization'] || headers['x-access-token'];
    const serverToken = process.env.TOKEN;

    if (!clientToken === serverToken) return res.status(400).send('Invalid token.');
    next();
});

router.post('/', async (_, res) => {
    cron.schedule('1 * * * *', function () {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '<your-email>@gmail.com',
                // use generated app password for gmail
                pass: '***********'
            }
        });

        // setting credentials
        let mailDetails = {
            from: '<your-email>@gmail.com',
            to: '<user-email>@gmail.com',
            subject: 'Test Mail using Cron Job',
            text: 'Node.js Cron Job Email Demo Test from Outreach'
        };

        // sending email
        mailTransporter
            .sendMail(mailDetails)
            .then(() => res.status(200).json({ status: '200', message: 'Cron schduled succesfully' }))
            .catch(() => res.status(500).send('error' + error));
    });
});

module.exports = router;
