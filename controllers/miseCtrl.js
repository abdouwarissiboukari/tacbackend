const { Mise, sequelize, QueryTypes, Op } = require("../databases/sequelize")

exports.allMise = async (req, res, next) => {
  try{

    if(!req.query.zone || req.query.zone.length === 0){
      return res.status(401).json({ message: `La zone est obligatoire`})
    }

    if(!req.query.optiondt || req.query.optiondt === 0){
      return res.status(401).json({ message: `L'option de date est obligatoire`})
    }

    if(!req.query.date || req.query.date === 0){
      return res.status(401).json({ message: `La date est obligatoire`})
    }

    const getAllMise =(req.query.optiondt == 1)? await sequelize.query(
        `SELECT * FROM mise WHERE ZoneT = :Zone AND DateMise = :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      ):
      await sequelize.query(
        `SELECT * FROM mise WHERE ZoneT = :Zone AND DateMise >= :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      )

    return res.status(200).json({
      count: getAllMise.length,
      data: getAllMise
    })
  }
  catch(error) {
    return res.status(400).json({ 
      message : `Une error est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Details : {Error: error, Message: error.message}
     })
  }
}

exports.create = async (req, res, next) => {
  try{
    const miseObjects = req.body
    const errorMise =[]

    miseObjects.forEach(async (mise) => {
      if(mise.Client.length === 0 || parseInt(mise.Cycle) === 0 || parseInt(mise.Mois) === 0 || mise.Montant2.length === 0){
        errorMise.push({mise, Commentaire: `Information invalide`})
      }
      else
      {
        if(mise.Montant2 > 0){
          await Mise.findOne({ where: 
            {
              Cycle: mise.Cycle, 
              Montant2: {[Op.gt]: 0}
            }
          })
          .then(async (findedMise) => { 
                       
            if(!findedMise){              
              await Mise.create(mise) 
            }
            else{
              await Mise.update(
                {
                  Montant2: mise.Montant2,
                  DateMise: mise.DateMise
                },
                {
                  where: { Cycle: mise.Cycle, Montant2: { [Op.gt]: 0} }
                }
              )
            }
          })
        }
        else{ 
          await Mise.findOne(
            {
              where: {
                Cycle: mise.Cycle,
                Mois: mise.Mois,
                Annee: mise.Annee
              }
            }
          )
          .then(async (findedMise) => {
            if(!findedMise){
              await Mise.create(mise) 
            }
            else{
              errorMise.push({mise, Commentaire: `Mise déjà enrégistré`})
            }
          })          
        }
        
               
      }

      if(miseObjects.indexOf(mise) == miseObjects.length-1){
        return res.status(200).json({
          message: `Synchronisation achevée`,
          detail : {
            saved: miseObjects.length - errorMise.length,
            rejected: errorMise.length,
            elements: errorMise
          },
          State: (miseObjects.length - errorMise.length > 0)? true: false
        })
      }
    })

  }
  catch(error) {
    return res.status(400).json({ 
      message : `Une error est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Details : {Error: error, Message: error.message}
     })
  }
}