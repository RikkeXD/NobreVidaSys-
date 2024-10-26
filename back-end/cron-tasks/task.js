const cron = require('node-cron');
const {atualizarPedidosCriados } = require('./atualizarStatusPedido/atualizarStatusPedido');
const { backupDatabase } = require('./backupDatabase/backupDatabase');

cron.schedule('0 0 * * *', () => {
    console.log('Executando job: Atualizar pedidos criados...');
    atualizarPedidosCriados();
  });

  cron.schedule('0 2 * * *', () => { 
    console.log('Executando backup do banco de dados...');
    backupDatabase();
});


module.exports = cron