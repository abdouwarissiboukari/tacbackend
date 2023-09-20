module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
      'Utilisateur',
      {
        UserLogin: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique : { msg: `Nom d'utilisateur déjà utilisé.`},
            validate:
            {
                notEmpty: { msg: `Erreur: caractère vide on autorisé pour le nom d'utilisateur.`},
                notNull: { msg: `Le nom d'utilisateur est requis`}
            }
        },
        PassWords: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty: { msg: `Le mot de passe doit contenir au moins six caractères.`},
                notNull: { msg: `Le mot de passe est obligatoire.`}
            }
        },
        CodePin: {
            type: DataTypes.STRING,            
        },
        IsTempPin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Roles: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty: { msg: `Le rôle est obligatoire.`},
                notNull: { msg: `Le rôle est obligatoire.`}
            }        
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty: { msg: `Erreur: caractère vide on autorisé pour le nom complet.`},
                notNull: { msg: `Le nom complet est requis`}
            }
        },
        IdTitulaire: {
            type: DataTypes.STRING(10),
        },
        Statut: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
      },
      {
          timestamps: true,
          createdAt: 'DateCreate',
          updateAt: true,
          updateAt: 'Updated'
      }
  )
}