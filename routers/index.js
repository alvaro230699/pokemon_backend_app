const express = require('express')
const apiController = require('../controllers/api')
const router = express.Router()
router.use('/api', apiController)

module.exports = router
