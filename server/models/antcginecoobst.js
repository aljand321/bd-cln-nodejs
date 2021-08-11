module.exports = (sequelize, DataTypes) => {
  const antcGinecoObst = sequelize.define('antcGinecoObst', {    
    ritmo: DataTypes.STRING,
    fum: DataTypes.STRING,
    gesta: DataTypes.STRING,
    partos: DataTypes.STRING,
    cesarea: DataTypes.STRING,
    abortos: DataTypes.STRING,
    plfcFamiliar: DataTypes.STRING,    
    resultado: DataTypes.STRING,  
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