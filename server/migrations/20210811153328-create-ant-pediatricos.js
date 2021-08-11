'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('antPediatricos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pesoRn: {
        type: Sequelize.STRING
      },
      tipodeParto: {
        type: Sequelize.STRING
      },
      obsPerinatales: {
        type: Sequelize.STRING
      },
      id_paciente: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'pacientes',
          key: 'id',
          as: 'id_paciente',
        }
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
    await queryInterface.dropTable('antPediatricos');
  }
};