'use strict';
//Criando a Tabela Usuario atraves do comando: npx sequelize migration:create --name=create-user
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('usuarios', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    sobrenome: {
        type: Sequelize.STRING(40),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    recovery_code: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    permissao: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    empresa_principal:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'empresa',
          key: 'id'
        }
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    }
    })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('usuarios')
  }
};
//Para rodar a migration só utilizar o comando: npx sequelize db:migrate