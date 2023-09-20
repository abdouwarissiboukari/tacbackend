const express = require('express')
const clientCtrl = require('../controllers/clientCtrl')
const auth = require('../services/auth')
const multer = require('../services/multerconfig')
const router = express.Router()

router.post('/add/', auth, multer, clientCtrl.create)
router.post('/update/', auth, multer, clientCtrl.update)
router.get('/all/', auth, clientCtrl.allClient)

module.exports = router