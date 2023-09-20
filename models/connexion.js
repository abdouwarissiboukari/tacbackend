const actionValues = ['Connexion', 'Déconnexion']

module.exports = (sequelize, DataTypes ) => {
  return sequelize.define(
    'Connexion',
    {
      IdOuvert: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      UserLogin: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: `Le userlogin doit contenir une valeur`},
          notNull: { msg: `Le userlogin doit contenir une valeur `}
        }
      },
      Role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
          notEmpty: { msg: `Le rôle est obligatoire.`},
          notNull: { msg: `Le rôle est obligatoire.`}
        } 
      },
      Action: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isActionValid(value){
            if(!actionValues.includes(value)){
              throw new error(`La valeur action doit faire partir de la liste suivate : ${actionValues}`)
            }
          }
        }
      },
      DateAction: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: `La date est obligatoire`},
          isDate: { msg: `La valeur doit-être une date valide`}
        }
      },
      HeureAction: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: `La date est obligatoire`},
          notEmpty: { msg: `Le rôle est obligatoire.`},
        }
      }
    },
    {
      timestamps: false
    }
  )
}