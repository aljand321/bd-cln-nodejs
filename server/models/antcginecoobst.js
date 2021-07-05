module.exports = (sequelize, DataTypes) => {
  const antcGinecoObst = sequelize.define('antcGinecoObst', {    
    menarca: {
      type: DataTypes.STRING      
    },
    ritmo: DataTypes.STRING,
    fmu: DataTypes.STRING,
    gestaCesaria: DataTypes.STRING,
    abortos: DataTypes.STRING,
    nacidoVivos: DataTypes.STRING,
    mortinatos: DataTypes.STRING,
    plfcFamiliar: DataTypes.STRING,  
    fecha: {
      type:DataTypes.STRING,
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
    }
  }, {});
  antcGinecoObst.associate = (models) => {
    // associations can be defined here
    antcGinecoObst.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
    antcGinecoObst.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return antcGinecoObst;
};