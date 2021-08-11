module.exports = (sequelize, DataTypes) => {
  const responsablePaciente = sequelize.define('responsablePaciente', {
    descripcion: {
      type: DataTypes.TEXT
    },
    id_responsable: {
      type: DataTypes.INTEGER      
    },
    id_paciente: {
      type: DataTypes.INTEGER      
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
  responsablePaciente.associate = (models) => {
    // associations can be defined here
    responsablePaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return responsablePaciente;
};