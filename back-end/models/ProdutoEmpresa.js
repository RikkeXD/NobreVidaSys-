const { Model, DataTypes } = require('sequelize');

class ProdutoEmpresa extends Model {
    static init(sequelize) {
        super.init({
            produto_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'produtos',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            empresa_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'empresa',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        }, {
            sequelize,
            tableName: 'produto_empresa'
        });
    }
}

module.exports = ProdutoEmpresa;
