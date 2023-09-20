require("express-async-errors");
require("dotenv").config();

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')

const sequelize = require('./databases/sequelize');

const roleRoutes = require('./routes/roleRoute');
const userRoutes = require('./routes/userRoute');
const connexionRoutes = require("./routes/connexionRoute");
const clientTempoRoutes = require('./routes/clienttempoRoute')
const clientRoutes =require('./routes/clientRoute')
const cycleRoutes= require('./routes/cycleRoute')
const miseRoutes= require('./routes/miseRoute')
const collecteRoutes= require('./routes/collecteRoute')

const app = express()
const port = process.env.PORT || 3000
const host =process.env.HOST || 'http://localhost'
codeInit = ''
freeDays= 0

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(bodyParser.json())
  .use(cors())
  .use('/images', express.static(path.join(__dirname, 'images')))

sequelize.initDb()

app.get('/', (req, res) => {
  res.json('Tac Backend API! 👋🏿')
})

// Ici, nous placeront nos futurs points de terminaisons
app.use('/api/role', roleRoutes)
app.use('/api/user', userRoutes)
app.use('/api/connexion', connexionRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/cycle', cycleRoutes)
app.use('/api/mise', miseRoutes)
app.use('/api/collecte', collecteRoutes)

app.use('/api/clienttempo', clientTempoRoutes)


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