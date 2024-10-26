const { Model, DataTypes } = require('sequelize')

class Produto extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            fornecedor: DataTypes.STRING,
            cod_barras: DataTypes.STRING,
            peso: DataTypes.DOUBLE,
            ativo: DataTypes.BOOLEAN
        }, {
            sequelize
        })
    }
    static associate(model) {
        this.belongsToMany(model.Empresa, { through: 'produto_empresa', foreignKey: 'produto_id', as: 'empresa' })
        this.belongsToMany(model.Pedido, {
            through: model.ProdutoPedido,
            foreignKey: 'produto_id',
            otherKey: 'pedido_id',
            as: 'pedido'
        });
        this.hasMany(model.ProdutoPedido, { foreignKey: 'produto_id', as: 'produtoPedido' });
    }
}
module.exports = Produto