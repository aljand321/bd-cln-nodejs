module.exports = (sequelize, DataTypes) => {
  const otrasEnfPaciente = sequelize.define('otrasEnfPaciente', {
    id_paciente: {
      type: DataTypes.INTEGER      
    },
    id_otrasEnf: {
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
  otrasEnfPaciente.associate = (models) => {
    // associations can be defined here
    otrasEnfPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return otrasEnfPaciente;
};