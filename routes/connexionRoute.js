const express = require('express')
const router = express.Router()
const connexionCtrl = require('../controllers/connexionCtrl')
const auth = require('../services/auth')

router.get('/all/',auth, connexionCtrl.allConnexion)

module.exports = router