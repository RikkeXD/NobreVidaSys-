const {Model, DataTypes } = require ('sequelize')

class Cliente extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            sobrenome: DataTypes.STRING,
            telefone: DataTypes.STRING,
            cpf: DataTypes.STRING,
            email: DataTypes.STRING,
            endereco: DataTypes.STRING,
            numero: DataTypes.STRING,
            cep: DataTypes.STRING,
            bairro: DataTypes.STRING,
            cidade: DataTypes.STRING,
            complemento: DataTypes.STRING,
            uf: DataTypes.STRING,
            ativo: DataTypes.BOOLEAN,
            id_usuario: DataTypes.INTEGER
        }, {
            sequelize
        })
    }
    static associate(models) {
        this.belongsToMany(models.Empresa, {through: 'cliente_empresa', foreignKey: 'cliente_id', as: 'empresa'}),
        this.hasMany(models.Pedido,{foreignKey: 'cliente_id', as: 'pedido'})
    }
    
}
module.exports =  Cliente