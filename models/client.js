module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'client',
    {
      IdClient: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true,
      },
      OldID: {
        type: DataTypes.STRING(30)
      },
      CompteEp: {
        type: DataTypes.STRING(30)
      },
      Produit: {
        type: DataTypes.STRING(30)
      },
      DateOuv: {
        type: DataTypes.DATEONLY
      },
      CarnetC: {
        type: DataTypes.STRING(30)
      },
      Nom: {
        type: DataTypes.STRING(40)
      },
      Prenom: {
        type: DataTypes.STRING(50)
      },
      Sexe: {
        type: DataTypes.STRING(2)
      },
      Profession: {
        type: DataTypes.STRING(100)
      },
      ZoneC: {
        type: DataTypes.STRING(10),
      },
      Tel: {
        type: DataTypes.STRING(15)
      },
      DateAdhesion: {
        type: DataTypes.DATEONLY
      },  
      Adresse: {
        type: DataTypes.TEXT
      },
      Messagerie: {
        type: DataTypes.STRING(150)
      },  
      Photo: {
        type: DataTypes.STRING(255)
      }, 
      PAP: {
        type: DataTypes.STRING(255)
      },  
      TelP: {
        type: DataTypes.STRING(15)
      }, 
      TelP: {
        type: DataTypes.STRING(255)
      }, 
      CompteEp: {
        type: DataTypes.STRING(30)
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