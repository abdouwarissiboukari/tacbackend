const { Sequelize, DataTypes, Op } = require('sequelize')
const UserModel = require('../models/utilisateur')
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
}
  
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
  
  return sequelize.sync({ alter: true}).then(_ => { 
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
  initDb, sequelize, Op, User
}