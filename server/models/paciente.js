module.exports = (sequelize, DataTypes) => {
  const paciente = sequelize.define('paciente', {
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
    sexo: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Seleccione sexo por favor'
      }
    },
    ci: {
      type: DataTypes.STRING
    },      
    telefono: {
      type: DataTypes.STRING
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Direccion es obligatorio'
      }
    },
    edad: {
      type: DataTypes.DATE,
      allowNull: {
        args: false,
        msg: 'Edad es obligatorio'
      }
    },
    ocupacion: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Inserte la ocupacion del paciente'
      }
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'No se esta mandando el id del medico'
      },
      references: {
        model: 'medicoUser',
        key: 'id',
        as: 'id_medico',
      }
    },
    
  }, {});
  paciente.associate = (models) => {
    // associations can be defined here    
    paciente.hasMany(models.consulta, {
      foreignKey: 'id_paciente',
    });
    paciente.hasMany(models.antcFamiliares, {
      foreignKey: 'id_paciente',
    });
    paciente.hasMany(models.antcGinecoObst, {
      foreignKey: 'id_paciente',
    });
    paciente.hasMany(models.antcPersonalesNoPtl, {
      foreignKey: 'id_paciente',
    });
    paciente.hasMany(models.antPediatricos, {
      foreignKey: 'id_paciente',
    });
    paciente.hasMany(models.archivosPaciente, {
      foreignKey: 'id_paciente',
    });
    paciente.belongsToMany(models.alergias,{
      through:'algPaciente',
      as: 'alergias',
      foreignKey:'id_paciente'
    });
    paciente.belongsToMany(models.transfuciones,{
      through:'trPaciente',
      as: 'transfuciones',
      foreignKey:'id_paciente'
    });
    paciente.belongsToMany(models.cirugiasPrevias,{
      through:'crPaciente',
      as: 'cirugiasPrevias',
      foreignKey:'id_paciente'
    });
    paciente.belongsToMany(models.OtrasEnfermedades,{
      through:'otrasEnfPaciente',
      as: 'OtrasEnfermedades',
      foreignKey:'id_paciente'
    });
    paciente.belongsToMany(models.vacunas,{
      through:'vacunasPaciente',
      as: 'vacunas',
      foreignKey:'id_paciente'
    });
    paciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return paciente;
};