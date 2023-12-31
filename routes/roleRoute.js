const express = require('express')
const router = express.Router()

const cltrRole = require('../controllers/roleCtrl')
const auth = require('../services/auth')

router.get('/all/', auth, cltrRole.allRoles)

module.exports = router