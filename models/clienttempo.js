module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'clienttempo',
    {
      Code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true,
        valide: {
          notEmpty: { msg: `Le code doit contenir une valeur`},
          notNull: { msg: `Le code doit contenir une valeur `}
        }
      },
      Nom: {
        type: DataTypes.STRING(40),
        allowNull: false,
        validate:
        {
            notEmpty: { msg: `Erreur: caractère vide on autorisé pour le nom.`},
            notNull: { msg: `Le nom est requis`}
        }
      },
      Prenom: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate:
        {
            notEmpty: { msg: `Erreur: caractère vide on autorisé pour le nom complet.`},
            notNull: { msg: `Le nom complet est requis`}
        }
      },
      Sexe: {
        type: DataTypes.STRING(2)
      },
      Profession: {
        type: DataTypes.STRING(100)
      },
      ZoneC: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate:
        {
            notEmpty: { msg: `Erreur: caractère vide on autorisé pour le nom complet.`},
            notNull: { msg: `Le nom complet est requis`}
        }
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
      Client: {
        type: DataTypes.STRING(30),
      }        
    },
    {
      timestamps: false
    }
  )
}