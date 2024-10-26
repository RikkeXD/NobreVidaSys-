const { Model, DataTypes } = require('sequelize');

class EtiquetaEnvio extends Model {
    static init(sequelize) {
        super.init({
            pedido_id: DataTypes.INTEGER,
            cod_rastreio: DataTypes.STRING,
            image: DataTypes.TEXT('long')
        }, {
            sequelize,
            tableName: 'etiqueta_envio'
        });
    }
    static associate(models) {
        this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    }
}

module.exports = EtiquetaEnvio;
