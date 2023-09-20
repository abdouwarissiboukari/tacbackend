module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'operation',
    {
      NumOp: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Client: {
        type: DataTypes.STRING(40)
      }, 
      Collecte:{
        type: DataTypes.INTEGER
      },
      Retrait:{
        type: DataTypes.INTEGER
      },
      DateOp: {
        type: DataTypes.DATEONLY
      },  
      DateJ: {
        type: DataTypes.DATEONLY
      },
      MCarnet:{
        type: DataTypes.INTEGER
      },  
      Mois: {
        type: DataTypes.INTEGER
      },  
      Cycle: {
        type: DataTypes.INTEGER
      }, 
      EcartM: {
        type: DataTypes.INTEGER
      },  
      Ecart: {
        type: DataTypes.INTEGER
      },  
      DateC: {
        type: DataTypes.DATEONLY
      },
      ZoneT:  {
        type: DataTypes.STRING(10)
      }, 
      IsRemboursement: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },  
      Numero: {
        type: DataTypes.INTEGER
      }, 
      IsManquant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }, 
   
      Utilisateur: {
        type: DataTypes.STRING(50)
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