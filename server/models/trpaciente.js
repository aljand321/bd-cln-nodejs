module.exports = (sequelize, DataTypes) => {
  const trPaciente = sequelize.define('trPaciente', {
    id_paciente: {
      type: DataTypes.INTEGER      
    },
    id_transfucion: {
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
  trPaciente.associate = (models) => {
    // associations can be defined here
    trPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return trPaciente;
};