const { Model, DataTypes } = require('sequelize')

class Pedido extends Model {
    static init(sequelize) {
        super.init({
            usuario_id: DataTypes.INTEGER,
            empresa_id: DataTypes.INTEGER,
            cliente_id: DataTypes.INTEGER,
            pagamento_id: DataTypes.INTEGER,
            embalagem_id: DataTypes.INTEGER,
            vlr_total: DataTypes.FLOAT,
            vlr_desc: DataTypes.FLOAT,
            envio: DataTypes.STRING,
            vlr_envio: DataTypes.FLOAT,
            status: DataTypes.ENUM('Criado', 'Enviado', 'Finalizado', 'Cancelado'),
            cod_rastreio: DataTypes.STRING,
            deleted_at: DataTypes.DATE,

        }, {
            sequelize,
            tableName: 'pedido',
            paranoid: true
        })
    }
    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuarios' });
        this.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'clientes' });
        this.belongsTo(models.Embalagem, { foreignKey: 'embalagem_id', as: 'embalagem' });
        this.hasMany(models.EtiquetaEnvio, { foreignKey: 'pedido_id', as: 'etiquetasEnvio' });
        this.hasOne(models.PagamentoPedido, { foreignKey: 'pedido_id', as: 'pagamento_pedido' });

        this.belongsToMany(models.Produto, {
            through: 'produto_pedido',
            foreignKey: 'pedido_id',
            otherKey: 'produto_id',
            as: 'produtos',
        });

        this.hasMany(models.ProdutoPedido, { foreignKey: 'pedido_id', as: 'produtoPedido' });
    }
}
module.exports = Pedido
