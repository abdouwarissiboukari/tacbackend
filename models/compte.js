module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'compte',
    {
      IdCompte: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true,
        valide: {
          notEmpty: { msg: `Le code doit contenir une valeur`},
          notNull: { msg: `Le code doit contenir une valeur `}
        }
      },
      Client: {
        type: DataTypes.STRING(40)
      },      
      DateOuv: {
        type: DataTypes.DATEONLY
      },
      Produit: {
        type: DataTypes.STRING(30)
      },  
      CarnetC: {
        type: DataTypes.STRING(30)
      }
    },
    {
      timestamps: false
    }
  )
}