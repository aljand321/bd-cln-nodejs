module.exports = (sequelize, DataTypes) => {
  const cirugiasPrevias = sequelize.define('cirugiasPrevias', {
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
  cirugiasPrevias.associate = (models) => {
    // associations can be defined here
    cirugiasPrevias.belongsToMany(models.paciente,{
      through:'crPaciente',
      as: 'paciente',
      foreignKey:'id_cirugiaP'
    });
    cirugiasPrevias.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return cirugiasPrevias;
};