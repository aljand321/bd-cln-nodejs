module.exports = (sequelize, DataTypes) => {
  const retornoPaciente = sequelize.define('retornoPaciente', {
    subjetivo: DataTypes.TEXT,
    objetivo: DataTypes.TEXT,
    diagnostico: DataTypes.TEXT,
    tratamiento: DataTypes.TEXT,
    signosVitales: DataTypes.JSON,    
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
    id_consulta: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'No se esta mandando el id de la consulta'
      },
      references: {
        model: 'consulta',
        key: 'id',
        as: 'id_consulta',
      }
    },
    
  }, {});
  retornoPaciente.associate = (models) => {
    // associations can be defined here
    retornoPaciente.belongsTo(models.consulta, {
      foreignKey: 'id_consulta',
      onDelete: 'CASCADE'
    });
    retornoPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return retornoPaciente;
};