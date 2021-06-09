'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class consulta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  consulta.init({
    motivo: DataTypes.TEXT,
    enfermedadActual: DataTypes.TEXT,
    signosVitales: DataTypes.JSON,
    examenFisoco: DataTypes.JSON,
    id_paciente: DataTypes.INTEGER,
    id_medico: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'consulta',
  });
  return consulta;
};