module.exports = (sequelize, DataTypes) => {
  const alergias = sequelize.define('alergias', {
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
  alergias.associate = (models) => {
    // associations can be defined here
    alergias.belongsToMany(models.paciente,{
      through:'algPaciente',
      as: 'paciente',
      foreignKey:'id_alergia'
    });
    alergias.belongsTo(models.medicoUser, {
      foreignKey: 'id_medico',
      onDelete: 'CASCADE'
    });
  };
  return alergias;
};