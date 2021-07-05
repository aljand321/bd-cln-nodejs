'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vacunasPaciente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  vacunasPaciente.init({
    description:DataTypes.STRING,
    fecha: DataTypes.STRING,
    id_paciente: DataTypes.INTEGER,
    id_vacuna: DataTypes.INTEGER,
    id_medico: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'vacunasPaciente',
  });
  return vacunasPaciente;
};