const { ViewClient, ClientTempo } = require("../databases/sequelize")

exports.allClient = async (req, res, next) => {
  try{
    if(!req.query.zone || req.query.zone.length === 0){
      return res.status(401).json({ message: `La zone est obligatoire`})
    }

    await ViewClient.findAndCountAll({where: { Zone: req.query.zone}})
      .then(({count, rows}) => {
        res.status(200).json({
          count: count,
          data: rows
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

exports.clientSave = async (req, res, next) => {
  try{
    const clientTempo = new ClientTempo(req.body)
    if(clientTempo.Code.length === 0 || clientTempo.Nom.length === 0 || clientTempo.Prenom.length === 0 || clientTempo.Tel.length === 0){
      return res.status(401).json({ 
        message : `Le client est invalid`,
        Client : clientTempo
      })
    }

    // console.log(clientTempo.dataValues.ZoneC)

    const clientCheck= await ClientTempo.findOne({ where: {
      ZoneC: clientTempo.dataValues.ZoneC,
      Nom: clientTempo.dataValues.Nom,
      Prenom: clientTempo.dataValues.Prenom,
      Tel: clientTempo.dataValues.Tel,
      DateAdhesion: clientTempo.dataValues.DateAdhesion
    }})

    if(clientCheck){
      return res.status(401).json({
        message: `Cet client a été déjà synchroniser`,
        Detail: clientCheck,
        state: false
      })
    }

    await clientTempo.save()
      .then(clientSaved => {
        return res.status(200).json({
          message: `Client enregisté`,
          Details : clientSaved,
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

exports.allClientSave = async(req, res, next) => {
  try{
    const clients = req.body
    if(clients.length === 0){
      return res.status(401).json({ message: `La liste des nouveau client est vide`})
    }

    const client= await ClientTempo.findOne({
      where: {
        ZoneC: clients[0].ZoneC,
        Nom: clients[0].Nom,
        Prenom: clients[0].Prenom,
        Tel: clients[0].Tel,
        DateAdhesion: clients[0].DateAdhesion
      }
    })

    if(client){
      return res.status(401).json({
        message: `La liste de nouveau client de la date du ${new Date(clients[0].DateAdhesion).toLocaleDateString()} a été déjà synchroniser`,
        CheckedClient: client
      })
    }

    await ClientTempo.bulkCreate(clients)
      .then(savedClients => {
        res.status(200).json({
          Message: `La synchronisation des nouveaux achevés`,
          Clients: savedClients.length
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

exports.allClientDelete = async(req, res, next) => {
  try{
    if(!req.query.zone || req.query.zone.length === 0){
      return res.status(401).json({ message: `La zone est obligatoire`})
    }

    if(!req.query.date || req.query.date.length === 0){
      return res.status(401).json({ message: `La date est obligatoire`})
    }

    await ClientTempo.destroy({
      where: {
        ZoneC: req.query.zone,
        DateAdhesion: req.query.date
      }
    })
    .then(result => {
      if(result>0)
      {
        res.status(200).json({
          message: `${result} enrégistrement(s) ont été suppimés`,
          State: true
        })
      }
      else{
        res.status(200).json({
          message: `Aucun enrégistrement n'a été retrouvé pour les paramètres renseignés.`,
          State: false
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