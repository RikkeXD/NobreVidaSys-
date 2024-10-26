const { Op } = require('sequelize');
const Pedido = require('../../models/Pedido')

async function atualizarPedidosCriados() {
    try {
      const agoraMenos72Horas = new Date(Date.now() - 72 * 60 * 60 * 1000);
  
      const pedidos = await Pedido.findAll({
        where: {
          status: 'Criado',
          created_at: { [Op.lte]: agoraMenos72Horas },
        },
      });
  

      for (const pedido of pedidos) {
        pedido.status = 'Enviado';
        await pedido.save();
        console.log(`Pedido #${pedido.id} atualizado para 'Enviado'`);
      }
    } catch (error) {
      console.error('Erro ao atualizar pedidos:', error);
    }
  }

  module.exports = {atualizarPedidosCriados}