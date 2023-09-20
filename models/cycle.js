module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'cycle',
    {
      Numero: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      DateDeb: {
        type: DataTypes.DATEONLY
      },
      DateFin: {
        type: DataTypes.DATEONLY
      },
      Dure: {
        type: DataTypes.INTEGER
      },
      Client: {
        type: DataTypes.STRING(40)
      },      
      Mois: {
        type: DataTypes.INTEGER
      },
      TypeCy: {
        type: DataTypes.STRING(30)
      },
      Cloture:  {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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