module.exports = (sequelize, DataTypes) => {
  const archivosPaciente = sequelize.define('archivosPaciente', {
    descripcion: {
      type: DataTypes.TEXT      
    },
    archivo: {
      type: DataTypes.STRING      
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
  archivosPaciente.associate = (models) => {
    // associations can be defined here
    archivosPaciente.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
    archivosPaciente.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
  };
  return archivosPaciente;
};