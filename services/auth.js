const jwt = require('jsonwebtoken')
const privateKey = process.env.JWT_SECRET
  
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message })
  }
    
  const token = authorizationHeader.split(' ')[1]

  jwt.verify(token, privateKey, (error, decodedToken) => {
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error, authorizationHeader })
    }
    
    const Username = decodedToken.Username
    if (req.body.Username && req.body.Username !== Username) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } 
    else {
      req.auth = {
        UserLogin: Username
      }
      next()
    }
  })
}