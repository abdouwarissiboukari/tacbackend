module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'mise',
    {
      NumMise: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Montant2:{
        type: DataTypes.INTEGER
      },
      DateMise: {
        type: DataTypes.DATEONLY
      },
      Client: {
        type: DataTypes.STRING(40)
      },        
      Mois: {
        type: DataTypes.INTEGER
      },  
      Annee: {
        type: DataTypes.INTEGER
      },
      Cycle: {
        type: DataTypes.INTEGER
      },
      Titulaire: {
        type: DataTypes.STRING(10)
      },
      Utilisateur: {
        type: DataTypes.STRING(50)
      },
      ZoneT:  {
        type: DataTypes.STRING(10)
      },
      IsNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: false
    }
  )
}