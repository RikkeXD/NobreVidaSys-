const { Model, DataTypes } = require('sequelize');

class UsuarioEmpresa extends Model {
    static init(sequelize) {
        super.init({
            usuario_id: DataTypes.INTEGER,
            empresa_id: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'produto_empresa'
        });
    }
}

module.exports = UsuarioEmpresa;
