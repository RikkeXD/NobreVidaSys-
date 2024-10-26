const {Model, DataTypes } = require ('sequelize')
const Usuario = require('../models/Usuario')

class Empresa extends Model{
    static init(sequelize) {
        super.init({
            razao_social: DataTypes.STRING,
            cnpj: DataTypes.STRING,
            telefone: DataTypes.STRING,
            email: DataTypes.STRING,
            endereco: DataTypes.STRING,
            numero: DataTypes.STRING,
            cep: DataTypes.STRING,
            bairro: DataTypes.STRING,
            cidade: DataTypes.STRING,
            complemento: DataTypes.STRING,
            uf: DataTypes.STRING,
            ativo: DataTypes.BOOLEAN,
            image: DataTypes.TEXT('long')
        }, {
            sequelize,
            tableName: 'empresa'
        })
    }
    static associate(model){
        this.belongsToMany(model.Usuario, {through: 'usuario_empresa', foreignKey: 'empresa_id', as: 'usuarios'}),
        this.belongsToMany(model.Cliente, {through: 'cliente_empresa', foreignKey: 'empresa_id', as: 'clientes'}),
        this.belongsToMany(model.Produto, {through: 'produto_empresa', foreignKey: 'empresa_id', as: 'produtos'}),
        this.belongsToMany(model.Embalagem, {through: 'embalagem_empresa', foreignKey: 'empresa_id', as: 'embalagem'}),
        this.hasMany(model.Pedido,{foreignKey: 'empresa_id', as: 'pedido'})
    }
}
module.exports =  Empresa