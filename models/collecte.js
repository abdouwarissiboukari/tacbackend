module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'collecte',
    {
      NumCol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      DateCol: {
        type: DataTypes.DATEONLY
      },
      MtantCol:{
        type: DataTypes.INTEGER
      },
      Titulaire: {
        type: DataTypes.STRING(10)
      },
      ZoneT:  {
        type: DataTypes.STRING(10)
      },    
      Client: {
        type: DataTypes.STRING(40)
      },        
      MoisC: {
        type: DataTypes.INTEGER
      },  
      Cycle: {
        type: DataTypes.INTEGER
      },   
      Carnet: {
        type: DataTypes.STRING(50)
      },    
      Utilisateur: {
        type: DataTypes.STRING(50)
      },   
      IsManquant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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