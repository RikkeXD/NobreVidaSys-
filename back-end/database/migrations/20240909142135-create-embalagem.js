'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('embalagem', {
      id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      nome:{
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      altura:{
        allowNull: false,
        type: Sequelize.FLOAT
      },
      largura:{
        allowNull: false,
        type: Sequelize.FLOAT
      },
      comprimento:{
        allowNull: false,
        type: Sequelize.FLOAT
      },
      peso:{
        allowNull: false,
        type: Sequelize.FLOAT
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    })
    
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('embalagem')
  }
};
