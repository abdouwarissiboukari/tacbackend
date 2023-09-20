const { ClientTempo, Client, Compte, sequelize, QueryTypes, ClientView, Retrait } = require("../databases/sequelize")
const fs = require('fs')

const nextIdClient = async () => {
  const idClient = `AN${new Date().toISOString().slice(2, 4)}M${new Date().toISOString().slice(5, 7)}ORD`

  const getLastID = await sequelize.query(
    `SELECT MAX(IdClient) AS MaxID FROM clients WHERE IdClient LIKE :idClient`, 
    { 
      replacements: { idClient: `${idClient}%`},
      type: QueryTypes.SELECT 
    }
  )

  const nextNumber = getLastID[0].MaxID? String(parseInt(getLastID[0].MaxID.slice(13, 18)) + 1).padStart(6, '0') : String('1').padStart(6, '0')  

  return `${idClient}${nextNumber}`
}

const nextIdCompte = async (produit) => {
  const idCompte = `${produit.slice(0, 4)}${codeInit}`

  const getLastID = await sequelize.query(
    `SELECT MAX(IdCompte) AS MaxID FROM compte WHERE IdCompte LIKE :idCompte`, 
    { 
      replacements: { idCompte: `${produit.slice(0, 4)}%`},
      type: QueryTypes.SELECT 
    }
  )

  const nextNumber = getLastID[0].MaxID? String(parseInt(getLastID[0].MaxID.slice(7, 11)) + 1).padStart(5, '0') : String('1').padStart(5, '0')  

  return `${idCompte}${nextNumber}`
}

exports.create = async (req, res, next) => {
  try{
    const produit = req.body.produit

    if(!produit || produit.length === 0)  {
      return res.status(401).json({ 
        message : `Le produit est requis`,
        isadd: false
      })
    }

    const idClient = await nextIdClient()
    const idCompte = await nextIdCompte(produit)

    const client = req.file? 
      new Client({
        ...JSON.parse(req.body.client), 
        IdClient: idClient,
        Photo: `${req.protocol}://${req.get('host')}/images/client/${req.file.filename}`
      }):
      new Client({
        ...JSON.parse(req.body.client),
        IdClient: idClient,
        Photo: `chemin`
      })

    if(!client.Nom.length || !client.Prenom || !client.Tel)  {
      return res.status(401).json({ 
        message : `Le client est invalid`,
        detail : client,
        isadd: false
      })
    }

    if(client.Nom.length === 0 || client.Prenom.length === 0 || client.Tel.length === 0)  {
      return res.status(401).json({ 
        message : `Le client est invalid`,
        detail : client,
        isadd: false
      })
    }

    await client.save()
      .then(clientSave => {
        
        if(!clientSave){
          return res.status(401).json({ 
            message : `Une erreur s'est produite, client non enrégistré`,
            detail : client,
            isadd: false
          })
        }

        Compte.create({
          IdCompte: idCompte,
          Client: clientSave.IdClient,
          DateOuv: clientSave.DateAdhesion,
          Produit: produit
        })
        .then(compteSave => {
          Retrait.create({
            Client: compteSave.IdCompte,
            MtantRet: 0,
            DateRetrait: compteSave.DateOuv,
            TypeRet: 'Caisse',
            Utilisateur: req.auth.UserLogin
          })
          .then(() => {
            return res.status(200).json({
              client: {
                IdClient: compteSave.IdCompte,
                Nom: clientSave.Nom,
                Prenom: clientSave.Prenom,
                Tel: clientSave.Tel,
                Produit: compteSave.Produit
              },
              isadd: true
            })
          })
          
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

exports.update = async (req, res, next) => {
  try{
    const idClient = req.query.idclient
    
    if(!idClient || idClient.length != 11 )  {
      return res.status(401).json({ 
        message : `IdClient incorrect`,
        isadd: false
      })
    }

    const clientObject = req.file? 
      {
        ...JSON.parse(req.body.client), 
        Photo: `${req.protocol}://${req.get('host')}/images/client/${req.file.filename}`
      }:
      {
        ...JSON.parse(req.body.client)
      }

      const getClient = await sequelize.query(
        `SELECT Client FROM compte WHERE IdCompte = :idClient`, 
        { 
          replacements: { idClient: `${idClient}`},
          type: QueryTypes.SELECT 
        }
      )

      if(!getClient[0]){
        return res.status(401).json({ 
          message : `Client introuvable`,
          isadd: false
        })
      }

      await Client.findOne({ where: {IdClient: getClient[0].Client}})
        .then(client => {          
          const actualPhotoUrl = (client.Photo == "chemin")? "chemin": client.Photo.split('/images/client/')[1]

          Client.update(
              clientObject, 
              { where: {IdClient: client.IdClient}
            })
            .then(result => {

              if(result == 0){
                return res.status(401).json({ message: `Mise à jour non achevée`})
              }

              if (req.file) {    
                if (actualPhotoUrl != 'chemin'){
                    fs.unlink(`images/client/${actualPhotoUrl}`, () => {})
                }
              } 

              return res.status(200).json({ 
                message: `Mise à jour éffectué`,
                isupadate: true
              })
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

exports.allClient = async (req, res, next) => {
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

    const getAllClient =(req.optiondt = 1)? await sequelize.query(
        `SELECT * FROM client WHERE ZoneC = :ZoneC AND DateAdhesion = :Date`, 
        { 
          replacements: { ZoneC: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      ):
      await sequelize.query(
        `SELECT * FROM client WHERE ZoneC = :ZoneC AND IdClient IN (SELECT Client FROM collecte Where DateCol <= :Date)`, 
        { 
          replacements: { ZoneC: `${req.query.zone}`, Date: `${req.query.date}`},
          type: QueryTypes.SELECT 
        }
      )


    return res.status(200).json({
      count: getAllClient.length,
      data: getAllClient
    })
  }
  catch(error) {
    return res.status(400).json({ 
      message : `Une error est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Details : {Error: error, Message: error.message}
     })
  }
}
