require("express-async-errors");
require("dotenv").config();

const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cors = require('cors')

const sequelize = require('./databases/sequelize')

const roleRoutes = require('./routes/roleRoute')
const userRoutes = require('./routes/userRoute')

const app = express()
const port = process.env.PORT || 3000
const host =process.env.HOST || 'http://localhost'

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(bodyParser.json())  
  .use(cors())

sequelize.initDb()

app.get('/', (req, res) => {
  res.json('Tac Backend API! 👋🏿')
})

// Ici, nous placeront nos futurs points de terminaisons
app.use('/api/role', roleRoutes)
app.use('/api/user', userRoutes)


// app.use((error, req, res, next) => {
//   console.log(error)
//   res.status(500).json({ error: error.message });
// });

// On ajoute la gestion des erreurs 404
app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée! vous pouvez essayez une autre URL.'
  res.status(404).json({message})
})


app.listen(port, () => console.log(`Notre application Node est démarrée sur : ${host}:${port}`))