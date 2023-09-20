const express = require('express')
const router = express.Router()
const cycleCtrl = require('../controllers/cycleCtrl')
const auth = require('../services/auth')

router.post('/add/', auth, cycleCtrl.create)
router.get('/all/', auth, cycleCtrl.allCycle)
router.get('/allactif/', auth, cycleCtrl.allCycleActif)

module.exports = router