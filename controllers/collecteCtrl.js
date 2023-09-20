const { Collecte, Operation, sequelize, QueryTypes, Op } = require("../databases/sequelize")

exports.allCollecte = async (req, res, next) => {
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

    const getAllCollecte =(req.query.optiondt == 1)? await sequelize.query(
        `SELECT * FROM collecte WHERE ZoneT = :Zone AND DateCol = :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      ):
      await sequelize.query(
        `SELECT * FROM collecte WHERE ZoneT = :Zone AND DateCol >= :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      )

    return res.status(200).json({
      count: getAllCollecte.length,
      data: getAllCollecte
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
    const collecteObjects = req.body
    const errorCollecte =[]

    collecteObjects.forEach(async (collecte) => {
      if(collecte.Client.length === 0 || parseInt(collecte.Cycle) === 0 || parseInt(collecte.MoisC) === 0 || parseInt(collecte.MtantCol) === 0){
        errorCollecte.push({collecte, Commentaire: `Information invalide`})
      }
      else
      {
        await Collecte.create(collecte)
          .then(async (savedCollecte) => {
            await Operation.findOne({
              where: {
                Client: collecte.Client,
                DateOp: collecte.DateCol 
              }
            })
            .then(async (findedOperation) => {
              if(!findedOperation){
                await Operation.create({
                  Client: collecte.Client,
                  Collecte: collecte.MtantCol,
                  Retrait: 0,
                  DateOp: collecte.DateCol,
                  Mois: collecte.MoisC,
                  Cycle: collecte.Cycle,
                  ZoneT: collecte.ZoneT
                })
              }
              else{
                await Operation.update(
                  { Collecte: collecte.MtantCol, Mois: collecte.MoisC, Cycle: collecte.Cycle},
                  { where: { NumOp: findedOperation.NumOp}}
                )
              }
            })
          })         
               
      }

      if(collecteObjects.indexOf(collecte) == collecteObjects.length-1){
        return res.status(200).json({
          message: `Synchronisation achevée`,
          detail : {
            saved: collecteObjects.length - errorCollecte.length,
            rejected: errorCollecte.length,
            elements: errorCollecte
          },
          State: (collecteObjects.length - errorCollecte.length > 0)? true: false
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