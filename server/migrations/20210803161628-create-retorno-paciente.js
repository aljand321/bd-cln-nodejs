'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('retornoPacientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subjetivo: {
        type: Sequelize.TEXT
      },
      objetivo: {
        type: Sequelize.TEXT
      },
      diagnostico: {
        type: Sequelize.TEXT
      },
      tratamiento: {
        type: Sequelize.TEXT
      },
      signosVitales: {
        type: Sequelize.JSON
      },
      id_medico: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'medicoUsers',
          key: 'id',
          as: 'id_medico',
        }
      },
      id_consulta: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'consulta',
          key: 'id',
          as: 'id_consulta',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('retornoPacientes');
  }
};