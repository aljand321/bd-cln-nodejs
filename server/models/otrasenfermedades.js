module.exports = (sequelize, DataTypes) => {
  const OtrasEnfermedades = sequelize.define('OtrasEnfermedades', {
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
  OtrasEnfermedades.associate = (models) => {
    // associations can be defined here
    OtrasEnfermedades.belongsToMany(models.paciente,{
      through:'otrasEnfPaciente',
      as: 'paciente',
      foreignKey:'id_otrasEnf'
    });
    OtrasEnfermedades.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return OtrasEnfermedades;
};