
const { Router } = require("express");
const scheduleRoute = Router()
const { create,trackmail } = require("../controllers/shedule/index");
const isAuth = require('../middlewares/isAuth')

scheduleRoute.post('/create',isAuth,create)
scheduleRoute.get('/trackmail',trackmail)


module.exports = scheduleRoute;

