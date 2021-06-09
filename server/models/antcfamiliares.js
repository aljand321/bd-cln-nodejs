module.exports = (sequelize, DataTypes) => {
  const antcFamiliares = sequelize.define('antcFamiliares', {
    padre: {
      type: DataTypes.JSON      
    },
    madre: {
      type: DataTypes.JSON      
    },
    hnos: {
      type: DataTypes.JSON
    },
    estSalud: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Este campo es obligatorio'
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
  antcFamiliares.associate = (models) => {
    // associations can be defined here
    antcFamiliares.belongsTo(models.paciente, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
  };
  return antcFamiliares;
};