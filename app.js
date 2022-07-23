'use strict'
require('dotenv-defaults').config({
  path: './.env',
  encoding: 'utf8',
  defaults: './.env.defaults'
})
const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routers/index')

app.use(express.json())
app.use(cors())
app.use(router)
const port = process.env.PORT

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = { app, server }
