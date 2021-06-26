module.exports = (sequelize, DataTypes) => {
  const crPaciente = sequelize.define('crPaciente', {
    id_paciente: {
      type: DataTypes.INTEGER      
    },
    id_cirugiaP: {
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
  crPaciente.associate = (models) => {
    // associations can be defined here
    crPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return crPaciente;
};