module.exports = (sequelize, DataTypes) => {
  const algPaciente = sequelize.define('algPaciente', {
    id_paciente: {
      type: DataTypes.INTEGER      
    },
    id_alergia: {
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
  algPaciente.associate = (models) => {
    // associations can be defined here
    algPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return algPaciente;
};