const { User, Op, Connexion, sequelize, QueryTypes } = require('../databases/sequelize')
const { getDigitalCode } = require('../helpers')
const bcryptSalt = process.env.BCRYPT_SALT
const jwtSecret = process.env.JWT_SECRET
const Roles = require('../models/role')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res, next) => {
  try {
    const isFind = Object.values(Roles).includes(req.body.Roles)
    if(!isFind){
      return res.status(400).json({ message: `Le rôle renseigner est invalide` })
    }

    if(req.body.UserLogin.len<3){
      return res.status(401).json({message: `Le username doit contenir au moins 3 caractères.`})
    }

    await bcrypt.hash(req.body.CodePin, Number(bcryptSalt))
      .then(hash => {
        const user = new User({...req.body, CodePin: hash})
        user.save()
        .then(user => res.status(200).json({
            UserLogin: user.UserLogin,
            FullName : user.FullName,
            CodePin: user.CodePin,
            Roles: user.Roles            
          })
        ).catch(error => res.status(400).json({ error }))
      })    
  }
  catch (error) {
    return res.status(400).json({ 
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
     })
  }
}

exports.connect = async (req, res, next) => {
  try {


    if(!req.body.username || req.body.username.len === 0){
      return res.status(400).json({ message : `Veuillez renseigner un Username valide`})
    }

    if(!req.body.codepin || req.body.codepin.len ===0){
      return res.status(400).json({ message : `Veuillez renseigner le code pin`})
    }

    await User.findOne({ where: { UserLogin: req.body.username, Etat: true}})
      .then(user => {
        if(!user)
        {
          return res.status(401).json({message: `Les informstions de connexions sont incorrectes`})
        }

        if(user.IsTempPin)
        {
          return res.status(401).json({message: `Vous devez changer le code pin temporaire pour acceder aux services.`})
        }

        bcrypt.compare(req.body.codepin, user.CodePin)
          .then(async (isValid) => {
            if(!isValid){
              return res.status(401).json({message: `Les informstions de connexions sont incorrectes`})
            }

            const todayDate = new Date().toISOString().slice(0, 10)
            const todayTime = new Date().toLocaleTimeString()

            await Connexion.create({
              UserLogin: user.UserLogin,
              Role: user.Roles,
              Action: 'Connexion',
              DateAction: todayDate,
              HeureAction: todayTime
            })

            const getZoneObject = await sequelize.query(
              `SELECT ZoneA FROM affectation WHERE Etat=b'1' AND Titulaire = :Titulaire`,
              {
                replacements: { Titulaire: `${user.IdTitulaire}` },
                type: QueryTypes.SELECT
              }
            )
            


            res.status(200).json({
              Username: user.UserLogin,
              FullName: user.FullName,
              Roles: user.Roles,
              Titulaire: user.IdTitulaire,
              Zone: getZoneObject[0].ZoneA,
              IsTempPin: user.IsTempPin,
              CodeInit: codeInit,
              Token: jwt.sign(
                {Username: user.UserLogin},
                jwtSecret,
                { expiresIn: '24h' }
              )
            })
          })        
      })    
  }
  catch( error ) {
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

exports.resetcodepin = async(req, res, next) => {
  try{
    let tempCodePin = await getDigitalCode(6)
    await bcrypt.hash(tempCodePin.toString(), Number(bcryptSalt))
          .then(hash => {
            User.update(
              {CodePin: hash, IsTempPin: true},
              {where: {UserLogin: req.body.username, Etat: true}}
            )
            .then(result => {
              if(result=0)
              {
                return res.status(401).json({ message: `Username invalide`})
              }
              res.status(200).json({
                message: `Code Pin réinitialisé. Connectez vous avec le Code Pin temporaire fourni afin de fournir un nouveau mot de passe.`,
                CodePinTempo: tempCodePin
              })
            })
           
          })
  }
  catch(error){
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

exports.changecodepin = async(req, res, next) => {
  try{
    if(!req.body.username || req.body.username.len === 0){
      return res.status(400).json({ message : `Veuillez renseigner un Username valide`})
    }

    if(!req.body.codepin || req.body.codepin.len ===0){
      return res.status(400).json({ message : `Veuillez renseigner le code pin`})
    }

    if(!req.body.newcodepin || req.body.newcodepin.len ===0){
      return res.status(400).json({ message : `Veuillez renseigner le nouveau code pin`})
    }

    await User.findOne({ where: { UserLogin: req.body.username}})
      .then(user => {
        if(!user)
          {
            return res.status(401).json({ message: `Username invalide`})
          }
        bcrypt.compare(req.body.codepin, user.CodePin)
          .then(isValid => {
            if(!isValid){
              return res.status(401).json({message: `Le Code Pin renseigné est incorrect.`})
            }
            bcrypt.hash(req.body.newcodepin, Number(bcryptSalt))
              .then(hash => {
                User.update(
                  {CodePin: hash, IsTempPin: false},
                  {where: { UserLogin: req.body.username}}
                )
                .then(result => {
                  if(result = 0){
                    res.status(500).json({message: `Une erreur interne est survenue. Veuillez réessayer plus tard...`})
                  }
    
                  res.status(200).json({message: `Le Code Pin a été mis à jours.`})
                })
              })
            
          })
      })
  }
  catch(error){
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

exports.update = async (req, res, next) => {
  try{
    if(!req.query.UserLogin || req.query.UserLogin.len<3){
      return res.status(401).json({message: `Le username n'est pas valide`})
    }

    if(req.body.Roles){
      const isFind = Object.values(Roles).includes(req.body.Roles)
      if(!isFind){
        return res.status(400).json({ message: `Le rôle renseigner est invalide` })
      }
    }

    User.update(
      { 
        Roles: req.body.Roles,
        FullName: req.body.FullName
      },
      {where: {UserLogin: req.query.UserLogin, Etat: true}}
    )
    .then(result => {
      if(result = 0){
        return res.status(401).json({message: `Une erreur est survenue, veuillez réessayez.`})
      }

      res.status(200).json({message: `Mise à jour éffectué avec succès.`})
    })
  }
  catch(error){
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

exports.getusers = async(req, res, next) => {
  try{
    if(req.query.name){
      await User.findOne({where: { UserLogin: req.query.name, Etat: true }})
        .then(user => {
          if(!user)
          {
            return res.status(200).json({message: `Cet username n'existe pas dans la base de données..`})
          }
          res.status(200).json(user)
        })
    }
    await User.findAndCountAll({where: { Etat: true }})
      .then(({count, rows}) => {
        if(count === 0){
          return res.status(200).json({message: `Aucun enrégistrement trouvé.`})
        }
        res.status(200).json({
          count: count,
          data: rows
        })
      })
  }
  catch(error){
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

exports.getusersbyname = async(req, res, next) => {
  try{
    if(!req.query.page || req.query.page == 0){
      return res.status(400).json({message: `Le page est obligatoire et doit-être superieure à 0`})
    }
    const page=req.query.page
    const limit = Number(req.query.limit) || 10
    const offSet = (page-1)*limit

    console.log(`${limit} ${offSet}`)

    if(req.query.name){
      await User.findAndCountAll({
        where: { 
          UserLogin: {
            [Op.like]: `%${req.query.name}%`
          },
          Etat: true
        },
        offset: offSet,
        limit: limit        
      })
      .then(({count, rows}) => {
        return res.status(200).json({
          count: count,
          data: rows
        })
      })    
    }
    
    await User.findAndCountAll({
      where: { 
        Etat: true
      },
      offset: offSet,
      limit: limit 
    })
    .then(({count, rows}) => {
      return res.status(200).json({
        count: count,
        data: rows
      })
    }) 
  }
  catch(error){
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}

