const express = require('express')
const router = express.Router()
const collecteCtrl = require('../controllers/collecteCtrl')
const auth = require('../services/auth')

router.get('/all/', auth, collecteCtrl.allCollecte)
router.post('/add/', auth, collecteCtrl.create)

module.exports = router