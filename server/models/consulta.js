module.exports = (sequelize, DataTypes) => {
  const consulta = sequelize.define('consulta', {
    motivo: DataTypes.TEXT,
    enfermedadActual: DataTypes.TEXT,
    diagPresuntivo: DataTypes.TEXT,
    conducta: DataTypes.TEXT,
    signosVitales: DataTypes.JSON,    
    
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
  consulta.associate = (models) => {
    // associations can be defined here
    consulta.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    consulta.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return consulta;
};