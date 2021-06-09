module.exports = (sequelize, DataTypes) => {
  const antcGinecoObst = sequelize.define('antcGinecoObst', {
    fecha: {
      type:DataTypes.DATE,
    },
    menarca: {
      type: DataTypes.NUMBER      
    },
    ritmo: DataTypes.STRING,
    fmu: DataTypes.STRING,
    gestaCesaria: DataTypes.STRING,
    abortos: DataTypes.STRING,
    nacidoVivos: DataTypes.INTEGER,
    mortinatos: DataTypes.INTEGER,
    plfcFamiliar: DataTypes.STRING,
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
  };
  return antcGinecoObst;
};