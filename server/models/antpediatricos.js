module.exports = (sequelize, DataTypes) => {
  const antPediatricos = sequelize.define('antPediatricos', {
    pesoRn: {
      type: DataTypes.STRING      
    },
    tipodeParto: {
      type: DataTypes.STRING      
    },
    obsPerinatales: {
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
  antPediatricos.associate = (models) => {
    // associations can be defined here    
    antPediatricos.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    antPediatricos.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
    
  };
  return antPediatricos;
};