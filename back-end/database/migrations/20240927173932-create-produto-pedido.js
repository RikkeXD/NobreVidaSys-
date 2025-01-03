'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('produto_pedido', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      pedido_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'pedido',
          key: 'id'
        }
      },
      produto_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'produtos',
          key: 'id'
        }
      },
      qntd: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vlr_desc:{
        type: Sequelize.FLOAT,
        allowNull: true
      },
      vlr_uni:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

    })
},
      
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('produto_pedido')
  }
};