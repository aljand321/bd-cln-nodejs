module.exports = (sequelize, DataTypes) => {
  const inmunizaciones = sequelize.define('inmunizaciones', {
    fecha: DataTypes.DATE,
    tipo: DataTypes.JSON,
    otros: DataTypes.STRING,
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
  inmunizaciones.associate = (models) => {
    // associations can be defined here
    inmunizaciones.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
  };
  return inmunizaciones;
};