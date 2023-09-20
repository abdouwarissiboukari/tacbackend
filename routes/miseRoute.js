const express = require('express')
const router = express.Router()
const miseCtrl = require('../controllers/miseCtrl')
const auth = require('../services/auth')

router.get('/all/', auth, miseCtrl.allMise)
router.post('/add/', auth, miseCtrl.create)

module.exports = router