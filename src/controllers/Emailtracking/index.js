
const path = require('path');
const jobSchema = require('../../model/jobSchema');
const { getGeolocationInfo } = require('../../utils');

const Emailtracking = (app) => {
  app.get('/trackmail', async (req, res) => {
    try {
      const { country, region, city, latitude, longitude } =
        await getGeolocationInfo(req.headers['x-forwarded-for'].split(',')[0]||req.connection.remoteAddress);
        console.log(req.headers)
      const { trackingId, email, scheduleId, messageId } = req.query;
      const data = await jobSchema.findOneAndUpdate(
        { trackingId: trackingId, email: email },
        {
          $push: {
            trackmail: {
              country:country||"",
              sheduleId: scheduleId,
              clickCount: 1,
              region:region||"",
              city:city||"",
              latitude:latitude||"",
              longitude:longitude||"",
              email: email,
              messageId,
              timestamp: Date.now(),
              fowarded: req.headers['x-forwarded-for'],
              opened: true,
              userAgent: req.headers['user-agent'],
              ipAddress: req.ip||"",
        
            },
          },
          $pull: { email: email },
        },
        { new: true }
      );
      if (data) {
        res.status(200).sendFile(path.resolve(process.cwd(), 'public', 'bg.gif'));
      } else {
        const updated = await jobSchema.findOneAndUpdate(
          { trackingId: trackingId, 'trackmail.email': email },
          { $inc: { 'trackmail.$.clickCount': 1 } },
          { new: true }
        );
        console.log(updated);
        res.status(200).sendFile(path.resolve(process.cwd(), 'public', 'bg.gif'));

      }
      res.status(200).sendFile(path.resolve(process.cwd(), 'public', 'bg.gif'));
    } catch (error) {
      console.log(error.message);
      res.status(200).sendFile(path.resolve(process.cwd(), 'public', 'bg.gif'));
    }
  });
};

module.exports = { Emailtracking };

