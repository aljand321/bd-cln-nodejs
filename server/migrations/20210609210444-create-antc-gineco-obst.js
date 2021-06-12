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
      fecha: {
        type: Sequelize.DATE
      },
      menarca: {
        type: Sequelize.DECIMAL
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
        type: Sequelize.INTEGER
      },
      mortinatos: {
        type: Sequelize.INTEGER
      },
      plfcFamiliar: {
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