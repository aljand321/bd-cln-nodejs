module.exports = (sequelize, DataTypes) => {
  const antcPersonalesNoPtl = sequelize.define('antcPersonalesNoPtl', {
    instruccion: DataTypes.STRING,
    fuma: DataTypes.JSON,
    bebe: DataTypes.JSON,
    alimentacion: DataTypes.STRING,
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
  antcPersonalesNoPtl.associate = (models) => {
    // associations can be defined here
    antcPersonalesNoPtl.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    antcPersonalesNoPtl.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return antcPersonalesNoPtl;
};