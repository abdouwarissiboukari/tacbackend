
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'retrait',
    {
      NumRetrait: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      DateRetrait: {
        type: DataTypes.DATEONLY
      },
      MtantRet: {
        type: DataTypes.INTEGER
      },
      MoisR: {
        type: DataTypes.INTEGER
      },
      Annee: {
        type: DataTypes.INTEGER
      },
      Client: {
        type: DataTypes.STRING(40)
      },
      TypeRet: {
        type: DataTypes.STRING
      },
      Utilisateur: {
        type: DataTypes.STRING(50)
      },
      ZoneT:  {
        type: DataTypes.STRING(10)
      },
      CompteEp: {
        type: DataTypes.STRING(30)
      },
      IsRemboursement: {
        type: DataTypes.BOOLEAN
      },
      Numero: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false
    }
  );
}