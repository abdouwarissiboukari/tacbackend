const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize')
const UserModel = require('../models/utilisateur')
const ConnexionModel = require('../models/connexion')
const ViewclientModel = require('../models/viewclient')
const ClientTempoModel= require('../models/clienttempo')
const ClientModel= require('../models/clients')
const CycleModel= require('../models/cycle')
const CompteModel = require('../models/compte')
const RetraitModel = require('../models/retrait')
const MiseModel = require('../models/mise')
const CollecteModel= require('../models/collecte')
const OperationModel = require('../models/operation')
const bcrypt = require('bcrypt')
const bcryptSalt = process.env.BCRYPT_SALT

let sequelize

if(process.env.NODE_ENV === 'production'){
  sequelize = new Sequelize(
    'db_a64746_tacdata',
    'a64746_tacdata',
    'tacdata2023',
    {
      host: 'mysql5047.site4now.net',
      dialect: 'mysql',
      dialectOptions: {
        timezone: '+00:00'
      },
      logging: false,
      timezone: '+00:00',
      define: {
        freezeTableName: true
      }
    }    
  )
}else{
  sequelize = new Sequelize(
    'db_a64746_tacdata',
    'x7log',
    'rush7',
    {
      host: '127.0.0.1',
      dialect: 'mysql',
      dialectOptions: {
        timezone: '+00:00'
      },
      logging: false,
      timezone: '+00:00',
      define: {
        freezeTableName: true
      }
    }    
  )
}
  
const User = UserModel(sequelize, DataTypes)
const Connexion = ConnexionModel(sequelize, DataTypes)
const ViewClient = ViewclientModel(sequelize, DataTypes)
const ClientTempo = ClientTempoModel(sequelize, DataTypes)
const Client = ClientModel(sequelize, DataTypes)
const Compte = CompteModel(sequelize, DataTypes)
const Cycle = CycleModel(sequelize, DataTypes)
const Retrait = RetraitModel(sequelize, DataTypes)
const Mise = MiseModel(sequelize, DataTypes)
const Collecte = CollecteModel(sequelize, DataTypes)
const Operation = OperationModel(sequelize, DataTypes)


const initDb = () => {
  
  return sequelize.sync({alter : true}).then(_ => { 
    sequelize.query("SELECT InitCompt, DelaiGrace FROM `configuration`", { type: QueryTypes.SELECT })
      .then(conf => {
        codeInit= conf[0].InitCompt,
        freeDays= conf[0].DelaiGrace
      })

    User.findAndCountAll({ where: {Roles : 'Super' } ,limit: 1})
    .then(({count, rows}) => {
        if(count === 0){
          bcrypt.hash('0770', Number(bcryptSalt))
          .then(hash => {
            User.create({
              UserLogin: 'x7log',
              PassWords: '0770',
              CodePin: hash,
              FullName: 'Top User',
              Roles: 'Super'
            })
            .then(user => console.log(user.toJSON()))
          })
        }
      }) 
    })     

    console.log('La base de donnée a bien été initialisée !')
  }
  
module.exports = { 
  initDb, sequelize, DataTypes, Op, QueryTypes, 
  User, Connexion, 
  ViewClient, ClientTempo, Client, Compte, 
  Cycle, Retrait, Mise, Collecte, Operation
}