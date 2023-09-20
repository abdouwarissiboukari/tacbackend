const express = require('express')
const route = express.Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../services/auth')

route.post('/add/', userCtrl.createUser)
route.post('/connect/', userCtrl.connect)
route.post('/resetcodepin/', userCtrl.resetcodepin)
route.post('/changecodepin/', auth, userCtrl.changecodepin)
route.put('/update/', auth, userCtrl.update)
route.get('/getusers/', auth, userCtrl.getusers)
route.get('/getusersbyname/', auth, userCtrl.getusersbyname)

module.exports = route