const { Model, DataTypes } = require('sequelize');

class EmbalagemEmpresa extends Model {
    static init(sequelize) {
        super.init({
            cliente_id: DataTypes.INTEGER,
            empresa_id: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'cliente_empresa'
        });
    }
}

module.exports = EmbalagemEmpresa;
