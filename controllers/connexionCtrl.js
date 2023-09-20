const { Connexion } = require("../databases/sequelize")

exports.allConnexion = async (req, res, next) => {
  try{
    await Connexion.findAndCountAll()
      .then(({count, rows}) => {
        res.status(200).json({
          count: count,
          data: rows
        })
      })
  }
  catch(error) {
    return res.status(400).json({
      message : `Un problème est survenu lors de la connexion, veuillez réessayer plus tard...`,
      Error : error.message
    })
  }
}