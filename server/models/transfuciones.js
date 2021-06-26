module.exports = (sequelize, DataTypes) => {
  const transfuciones = sequelize.define('transfuciones', {
    nombre: {
      type: DataTypes.STRING      
    },
    descripcion: {
      type: DataTypes.STRING      
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
  transfuciones.associate = (models) => {
    // associations can be defined here
    transfuciones.belongsToMany(models.paciente,{
      through:'trPaciente',
      as: 'paciente',
      foreignKey:'id_transfucion'
    });
    transfuciones.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return transfuciones;
};