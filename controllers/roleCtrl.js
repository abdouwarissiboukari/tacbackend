const Roles = require('../models/role')

exports.allRoles = (req, res, next) => {
  return res.status(200).json(Roles)
}