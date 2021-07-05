module.exports = (sequelize, DataTypes) => {
  const antcFamiliares = sequelize.define('antcFamiliares', {
    padre: {
      type: DataTypes.JSON      
    },
    madre: {
      type: DataTypes.JSON      
    },
    hnos: {
      type: DataTypes.JSON
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
  antcFamiliares.associate = (models) => {
    // associations can be defined here
    antcFamiliares.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    antcFamiliares.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return antcFamiliares;
};