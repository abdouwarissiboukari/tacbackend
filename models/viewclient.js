module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'viewclient',
    {
      IdClient: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allwNull: false,
      },
      Produit: {
        type: DataTypes.STRING(50)
      },
      DateOuverte: {
        type: DataTypes.DATEONLY
      },
      FullName: {
        type: DataTypes.STRING
      },
      Sexe: {
        type: DataTypes.STRING(20)
      },
      Profession: {
        type: DataTypes.STRING(100)
      },
      Zone: {
        type: DataTypes.STRING(10)
      },
      Carnet: {
        type: DataTypes.STRING(30)
      }
    },
    {
      timestamps: false
    }
  )
}