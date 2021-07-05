'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('examenFisicos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cabeza: {
        type: Sequelize.TEXT
      },
      cuello: {
        type: Sequelize.TEXT
      },
      torax: {
        type: Sequelize.TEXT
      },
      pulmones: {
        type: Sequelize.TEXT
      },
      corazon: {
        type: Sequelize.TEXT
      },
      abdomen: {
        type: Sequelize.TEXT
      },
      ginecoUrinario: {
        type: Sequelize.TEXT
      },
      locomotor: {
        type: Sequelize.TEXT
      },
      neurologico: {
        type: Sequelize.TEXT
      },
      pielyFaneras: {
        type: Sequelize.TEXT
      },
      diagnosticoPresuntivo: {
        type: Sequelize.TEXT
      },
      id_medico:{
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'medicoUsers',
          key: 'id',
          as: 'id_medico',
        }
      },
      id_paciente:{
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'pacientes',
          key: 'id',
          as: 'id_paciente',
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
    await queryInterface.dropTable('examenFisicos');
  }
};