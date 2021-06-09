module.exports = (sequelize, DataTypes) => {
  const antcPersonalesPtl = sequelize.define('antcPersonalesPtl', {
    alergias: DataTypes.STRING,
    transfuciones: DataTypes.STRING,
    cirugiasPre: DataTypes.STRING,
    otrasEnf: DataTypes.STRING,
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
  antcPersonalesPtl.associate = (models) => {
    // associations can be defined here
    antcPersonalesPtl.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
  };
  return antcPersonalesPtl;
};