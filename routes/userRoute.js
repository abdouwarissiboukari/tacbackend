const express = require('express')
const route = express.Router()
const userCtrl = require('../controllers/userCtrl')

route.post('/add/', userCtrl.createUser)
route.post('/connect/', userCtrl.connect)
route.post('/resetcodepin/', userCtrl.resetcodepin)
route.post('/changecodepin/', userCtrl.changecodepin)
route.put('/update/', userCtrl.update)
route.get('/getusers/', userCtrl.getusers)
route.get('/getusersbyname/', userCtrl.getusersbyname)

module.exports = route