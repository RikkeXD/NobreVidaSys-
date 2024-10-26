const {Model, DataTypes } = require ('sequelize')

class Embalagem extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            altura: DataTypes.FLOAT,
            largura: DataTypes.FLOAT,
            comprimento: DataTypes.FLOAT,
            peso: DataTypes.FLOAT,
            ativo: DataTypes.BOOLEAN,
        }, {
            sequelize,
            tableName: 'embalagem'
        })
    }
    static associate(models) {
        this.belongsToMany(models.Empresa, {through: 'embalagem_empresa', foreignKey: 'embalagem_id', as: 'empresa'}),
        this.hasMany(models.Pedido, {foreignKey: 'embalagem_id', as: 'pedido'})
    }
}
module.exports =  Embalagem