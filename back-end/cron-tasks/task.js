const cron = require('node-cron');
const {atualizarPedidosCriados } = require('./atualizarStatusPedido/atualizarStatusPedido')

cron.schedule('0 0 * * *', () => {
    console.log('Executando job: Atualizar pedidos criados...');
    atualizarPedidosCriados();
  });


module.exports = cron