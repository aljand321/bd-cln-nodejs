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
      ritmo: {
        type: Sequelize.STRING
      },
      fum: {
        type: Sequelize.STRING
      },
      gesta: {
        type: Sequelize.STRING
      },
      partos: {
        type: Sequelize.STRING
      },
      cesarea: {
        type: Sequelize.STRING
      },
      abortos: {
        type: Sequelize.STRING
      },
      plfcFamiliar: {
        type: Sequelize.STRING
      },      
      resultado:{
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