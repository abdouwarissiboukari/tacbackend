const express = require('express')
const clientTempoCtrl = require('../controllers/clienttempoCtrl')
const auth = require('../services/auth')
const { post } = require('./userRoute')
const router = express.Router()

router.get('/all/', auth, clientTempoCtrl.allClient)
router.post('/addlist/', auth, clientTempoCtrl.allClientSave)
router.post('/add/', auth, clientTempoCtrl.clientSave)
router.delete('/delete/', clientTempoCtrl.allClientDelete)

module.exports = router