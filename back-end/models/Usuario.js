const {Model, DataTypes } = require ('sequelize')
const Empresa = require('./Empresa')
const Pedido = require('./Pedido')

class Usuario extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            sobrenome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            recovery_code: DataTypes.STRING,
            permissao: DataTypes.INTEGER,
            ativo: DataTypes.BOOLEAN
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsToMany(models.Empresa, {through: 'usuario_empresa', foreignKey: 'usuario_id', as: 'empresa'}),
        this.belongsTo(models.Empresa, {
            foreignKey: 'empresa_principal',
            as: 'empresaPrincipal',
        });
        this.hasMany(models.Pedido,{foreignKey: 'usuario_id', as: 'pedido'})
    }
}

module.exports = Usuario
/*
*/