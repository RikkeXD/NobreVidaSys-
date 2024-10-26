const { Model, DataTypes } = require('sequelize');

class ClienteEmpresa extends Model {
    static init(sequelize) {
        super.init({
            cliente_id: DataTypes.INTEGER,
            empresa_id: DataTypes.INTEGER,
            qntd_parcela: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'cliente_empresa'
        });
    }
}

module.exports = ClienteEmpresa;
