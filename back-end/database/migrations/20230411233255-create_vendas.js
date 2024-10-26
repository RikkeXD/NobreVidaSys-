'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('vendas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      empresa_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'empresa',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cliente_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pagamento_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'pagamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vlr_total: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      envio: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      vlr_envio: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Criado', 'Enviado', 'Finalizado', 'Cancelado')
      },
      cod_rastreio:{
        allowNull: true,
        type: Sequelize.STRING(50)
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
    return queryInterface.dropTable('vendas')
  }
};
