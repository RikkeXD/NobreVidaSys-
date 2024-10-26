const { Model, DataTypes } = require('sequelize');

class PagamentoPedido extends Model {
    static init(sequelize) {
        super.init({
            pagamento_id: DataTypes.INTEGER,
            pedido_id: DataTypes.INTEGER,
            qntd_parcela: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'pagamento_pedido'
        });
    }
    static associate(models) {
        this.belongsTo(models.Pagamento, { foreignKey: 'pagamento_id', as: 'pagamentos' });
        this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    }
}

module.exports = PagamentoPedido;
