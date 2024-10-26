const { Model, DataTypes } = require('sequelize');

class ProdutoPedido extends Model {
  static init(sequelize) {
    super.init({
      pedido_id: DataTypes.INTEGER,
      produto_id: DataTypes.INTEGER,
      qntd: DataTypes.INTEGER,
      vlr_desc: DataTypes.FLOAT,
      vlr_uni: DataTypes.FLOAT,
    }, {
      sequelize,
      tableName: 'produto_pedido',
    });
  }
  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produtos' });
  }
}

module.exports = ProdutoPedido;
