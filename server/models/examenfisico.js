module.exports = (sequelize, DataTypes) => {
  const examenFisico = sequelize.define('examenFisico', {
    cabeza: {
      type: DataTypes.TEXT      
    },
    cuello: {
      type: DataTypes.TEXT      
    },
    torax: {
      type: DataTypes.TEXT      
    },
    pulmones: {
      type: DataTypes.TEXT      
    },
    corazon: {
      type: DataTypes.TEXT      
    },
    abdomen: {
      type: DataTypes.TEXT      
    },
    ginecoUrinario: {
      type: DataTypes.TEXT      
    },
    locomotor: {
      type: DataTypes.TEXT      
    },
    neurologico: {
      type: DataTypes.TEXT      
    },
    pielyFaneras: {
      type: DataTypes.TEXT      
    },
    diagnosticoPresuntivo:{
      type: DataTypes.TEXT
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'No se esta mandando el id del paciente'
      },
      references: {
        model: 'paciente',
        key: 'id',
        as: 'id_paciente',
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
    } 
  }, {});
  examenFisico.associate = (models) => {
    // associations can be defined here
    examenFisico.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    examenFisico.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return examenFisico;
};