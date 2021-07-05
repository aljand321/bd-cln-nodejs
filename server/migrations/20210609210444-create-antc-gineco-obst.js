'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('antcGinecoObsts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menarca: {
        type: Sequelize.STRING
      },
      ritmo: {
        type: Sequelize.STRING
      },
      fmu: {
        type: Sequelize.STRING
      },
      gestaCesaria: {
        type: Sequelize.STRING
      },
      abortos: {
        type: Sequelize.STRING
      },
      nacidoVivos: {
        type: Sequelize.STRING
      },
      mortinatos: {
        type: Sequelize.STRING
      },
      plfcFamiliar: {
        type: Sequelize.STRING
      },
      fecha:{
        type:Sequelize.STRING
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
      id_paciente: {
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
    await queryInterface.dropTable('antcGinecoObsts');
  }
};