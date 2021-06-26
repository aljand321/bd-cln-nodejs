'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('otrasEnfPacientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      id_otrasEnf: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'OtrasEnfermedades',
          key: 'id',
          as: 'id_otrasEnf',
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
    await queryInterface.dropTable('otrasEnfPacientes');
  }
};