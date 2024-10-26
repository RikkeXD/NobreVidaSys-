'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    return queryInterface.createTable('empresa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      razao_social: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(50)
      },
      telefone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      endereco: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      numero: {
        allowNull: false,
        type: Sequelize.STRING(15)
      },
      cep: {
        allowNull: false,
        type: Sequelize.STRING(11)
      },
      bairro: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      complemento:{
        type: Sequelize.STRING(50)
      },
      cidade:{
        type: Sequelize.STRING(30),
        allowNull: false
      },
      uf:{
        type: Sequelize.STRING(2),
        allowNull: false
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      image:{
        type: Sequelize.TEXT('long'),
        allowNull: true
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

   down (queryInterface, Sequelize) {
    return queryInterface.dropTable('empresa')
  }
};
