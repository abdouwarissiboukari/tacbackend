const { Cycle, sequelize, QueryTypes } = require("../databases/sequelize")

exports.allCycle = async (req, res, next) => {
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

    const getAllCycle =(req.optiondt == 1)? await sequelize.query(
        `SELECT * FROM cycleview WHERE Zone = :Zone AND DateDeb = :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      ):
      await sequelize.query(
        `SELECT * FROM cycleview WHERE Zone = :Zone AND DateDeb > :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      )


    return res.status(200).json({
      count: getAllCycle.length,
      data: getAllCycle
    })
  }
  catch(error) {
    return res.status(400).json({ 
      message : `Une error est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Details : {Error: error, Message: error.message}
     })
  }
}

exports.allCycleActif = async (req, res, next) => {
  try{
    if(!req.query.zone || req.query.zone.length == 0){
      return res.status(401).json({ message: `La zone est obligatoire`})
    }

    if(!req.query.optiondt || req.query.optiondt === 0){
      return res.status(401).json({ message: `L'option de date est obligatoire`})
    }

    if(!req.query.date || req.query.date === 0){
      return res.status(401).json({ message: `La date est obligatoire`})
    }
    console.log(req.query.optiondt)
    console.log(req.query.date)
    const getAllCycle =(req.query.optiondt = 1)? 
      await sequelize.query(
        `SELECT * FROM cycleview WHERE Cloture=b'1' AND Zone = :Zone AND DateDeb = :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      ):
      await sequelize.query(
        `SELECT * FROM cycleview WHERE Cloture=b'1' AND Zone = :Zone AND DateDeb >= :Date`, 
        { 
          replacements: { Zone: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      )

    return res.status(200).json({
      count: getAllCycle.length,
      data: getAllCycle
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
    const cycleObject = req.body

    if(cycleObject.Client.length === 0 || cycleObject.DateDeb.length === 0 || cycleObject.DateFin.length === 0 || cycleObject.Mois.length === 0 || cycleObject.TypeCy.length === 0){
      return res.status(401).json({ 
        message : `Le cycle est invalid`,
        detail : cycleObject
      })
    }

    const maxCycle= await sequelize.query(
      `SELECT MAX(Numero)+1 as MaxNumero FROM cycle`,
      {
        type: QueryTypes.SELECT
      }
    )
    
    const nextNumero =(maxCycle[0].MaxNumero)? maxCycle[0].MaxNumero : 1

    await Cycle.create({...cycleObject, Numero: nextNumero, DateFin: `${new Date(Date.parse(cycleObject.DateDeb) + (31+freeDays) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}`})
      .then(cycleSaved => {
        return res.status(200).json({
          message: `Synchronisation achevée`,
          detail : cycleSaved,
          State: true
        })
      })

  }
  catch(error) {
    return res.status(400).json({ 
      message : `Une error est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Details : {Error: error, Message: error.message}
     })
  }
}