const Sequelize = require('sequelize');
const configDB = require('../config/database'); // Importando as configurações de conexão com o Banco de dados

const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');
const Vendas = require('../models/Venda');
const Pagamento = require('../models/Pagamento');
const Venda_Produto = require('../models/Venda_Produto');
const Entrada_Produto = require('../models/Entrada_Produto');
const Empresa = require('../models/Empresa');
const ClienteEmpresa = require('../models/ClienteEmpresa');
const ProdutoEmpresa = require('../models/ProdutoEmpresa');
const UsuarioEmpresa = require('../models/UsuarioEmpresa');
const EmbalagemEmpresa = require('../models/EmbalagemEmpresa');
const Embalagem = require('../models/Embalagem');
const Pedido = require('../models/Pedido');
const ProdutoPedido = require('../models/ProdutoPedido');
const PagamentoPedido = require('../models/PagamentoPedido');
const EtiquetaEnvio = require('../models/EtiquetaEnvio');

const connection = new Sequelize(configDB);

// Inicialização dos modelos
Usuario.init(connection);
Cliente.init(connection);
Produto.init(connection);
Vendas.init(connection);
Pagamento.init(connection);
Venda_Produto.init(connection);
Entrada_Produto.init(connection);
Empresa.init(connection);
ClienteEmpresa.init(connection);
ProdutoEmpresa.init(connection);
UsuarioEmpresa.init(connection);
Embalagem.init(connection);
EmbalagemEmpresa.init(connection);
Pedido.init(connection);
ProdutoPedido.init(connection);
PagamentoPedido.init(connection);
EtiquetaEnvio.init(connection);

// Definição das associações
const models = { Usuario, Cliente, Produto, Pagamento, Empresa, ClienteEmpresa, ProdutoEmpresa, UsuarioEmpresa, Embalagem, EmbalagemEmpresa, Pedido, ProdutoPedido,PagamentoPedido,EtiquetaEnvio };

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


module.exports = connection;