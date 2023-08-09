const express = require('express')
const router = express.Router()

const cltrRole = require('../controllers/roleCtrl')

router.get('/all/', cltrRole.allRoles)

module.exports = router