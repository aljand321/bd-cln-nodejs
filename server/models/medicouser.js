const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  const medicoUser = sequelize.define('medicoUser', {
    nombres: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Inserte nombre por favor'
      }
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Inserte apellido por favor'
      }
    },
    ci: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Inserte C.I. por favor'
      }
    },
    email: {
      type: DataTypes.STRING,
    },
    telefono:{
      type:DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Inserte telefono por favor'
      }
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Direccion es obligatorio'
      }
    },
    edad:{
      type:DataTypes.DATE,
    },
    cargo:{
      type:DataTypes.STRING,
    },
    especialidad:{
      type:DataTypes.STRING,
    },
    img:{
      type:DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'La contracenia es obligatorio'
      }
    },
    role:{
      type:DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Rol del usario es obligatorio'
      }
    },
    
  }, {});
  medicoUser.beforeSave((user, options) => {
    if(user.changed('password')){
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    }
  })
  medicoUser.prototype.comparePassword = function (passw, cb){
    bcrypt.compare(passw, this.password, function(err, isMatch){
      if (err){
        return cb(err);
      }
      cb(null, isMatch)
    })
  }
  medicoUser.associate = (models) => {
    // associations can be defined here
    medicoUser.hasMany(models.paciente, {
      foreignKey: 'id_medico',
    });
    medicoUser.hasMany(models.consulta, {
      foreignKey: 'id_medico',
    });
    medicoUser.hasMany(models.vacunas, {
      foreignKey: 'id_medico',
    });
  };
  return medicoUser;
};