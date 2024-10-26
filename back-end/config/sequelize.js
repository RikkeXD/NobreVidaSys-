const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bancosv', 'root', 'senha123', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: true,
        underscored: true,
    }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
};

testConnection();

module.exports = sequelize;
