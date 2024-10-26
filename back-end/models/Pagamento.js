const {Model, DataTypes} = require ('sequelize')

class Pagamentos extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            qtd_parcela: DataTypes.INTEGER
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.belongsToMany(models.Pedido, {
            through: models.PagamentoPedido,
            foreignKey: 'pagamento_id',
            otherKey: 'pedido_id',
            as: 'pedido'
        });
    }
}
module.exports =  Pagamentos