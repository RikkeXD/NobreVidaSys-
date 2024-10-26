
const { Sequelize } = require('sequelize');
const Pedido = require('../models/Pedido');
const { Op } = require('sequelize');
const Produto = require('../models/Produto');
const ProdutoPedido = require('../models/ProdutoPedido');

function formatarNumero(valor) {
    return Number(valor).toFixed(2);
}

async function getVendaMensalPorEmpresa(empresaId, ano) {
    try {
        const vendasMensais = await Pedido.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'mes'],
                [Sequelize.fn('SUM', Sequelize.col('vlr_total')), 'total_vendas'],
            ],
            where: {
                empresa_id: empresaId,
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), ano)
                ]
            },
            group: ['mes'],
            order: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'ASC']],
        });

        const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const data = Array(12).fill(0);

        vendasMensais.forEach((venda) => {
            const mesIndex = venda.dataValues.mes - 1;
            data[mesIndex] = parseFloat(formatarNumero(venda.dataValues.total_vendas));
        });

        return { labels, data };
    } catch (error) {
        console.error('Erro ao buscar vendas mensais:', error);
        throw error;
    }
}

async function getVendaPorDiaDaSemana(empresaId, dataInicial, dataFinal) {
    try {
        const vendasPorDia = await Pedido.findAll({
            attributes: [
                [Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'dia_da_semana'],
                [Sequelize.fn('SUM', Sequelize.col('vlr_total')), 'total_vendas']
            ],
            where: {
                empresa_id: empresaId,
                created_at: {
                    [Op.between]: [dataInicial, dataFinal]
                }
            },
            group: ['dia_da_semana'],
            order: [[Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'ASC']]
        });

        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const vendasDiarias = Array(7).fill(0);

        vendasPorDia.forEach((venda) => {
            const diaIndex = venda.dataValues.dia_da_semana - 1;
            vendasDiarias[diaIndex] = parseFloat(venda.dataValues.total_vendas);
        });

        return {
            labels: diasSemana,
            data: vendasDiarias
        };
    } catch (error) {
        console.error('Erro ao buscar vendas por dia da semana:', error);
        throw error;
    }
}

async function getQuantidadeVendasPorDiaDaSemana(empresaId, dataInicial, dataFinal) {
    try {
        const quantidadeVendasPorDia = await Pedido.findAll({
            attributes: [
                [Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'dia_da_semana'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade_vendas']
            ],
            where: {
                empresa_id: empresaId,
                created_at: {
                    [Op.between]: [dataInicial, dataFinal]
                }
            },
            group: ['dia_da_semana'],
            order: [[Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'ASC']]
        });

        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const quantidadePorDia = Array(7).fill(0);

        quantidadeVendasPorDia.forEach((venda) => {
            const diaIndex = venda.dataValues.dia_da_semana - 1;
            quantidadePorDia[diaIndex] = parseInt(venda.dataValues.quantidade_vendas, 10);
        });

        return {
            labels: diasSemana,
            data: quantidadePorDia
        };
    } catch (error) {
        console.error('Erro ao buscar quantidade de vendas por dia da semana:', error);
        throw error;
    }
}

async function getTicketMedioPorDiaDaSemana(empresaId, dataInicial, dataFinal) {
    try {
        const ticketMedioPorDia = await Pedido.findAll({
            attributes: [
                [Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'dia_da_semana'],
                [Sequelize.fn('SUM', Sequelize.col('vlr_total')), 'total_vendas'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade_vendas']
            ],
            where: {
                empresa_id: empresaId,
                created_at: {
                    [Op.between]: [dataInicial, dataFinal]
                }
            },
            group: ['dia_da_semana'],
            order: [[Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'ASC']]
        });

        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const ticketMedioPorDiaArray = Array(7).fill(0);

        ticketMedioPorDia.forEach((venda) => {
            const diaIndex = venda.dataValues.dia_da_semana - 1;
            const totalVendas = parseFloat(venda.dataValues.total_vendas);
            const quantidadeVendas = parseInt(venda.dataValues.quantidade_vendas, 10);
            ticketMedioPorDiaArray[diaIndex] = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0;
        });

        return {
            labels: diasSemana,
            data: ticketMedioPorDiaArray
        };
    } catch (error) {
        console.error('Erro ao buscar ticket médio por dia da semana:', error);
        throw error;
    }
}

async function getResumoVendas(empresaId, dataInicial, dataFinal) {
    try {
        // Valor total de vendas e quantidade total de pedidos
        const resumo = await Pedido.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('vlr_total')), 'valorTotalVendas'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidadePedidos']
            ],
            where: {
                empresa_id: empresaId,
                created_at: {
                    [Op.between]: [dataInicial, dataFinal]
                }
            }
        });

        // Contagem de produtos vendidos
        const quantidadeProdutosVendidos = await ProdutoPedido.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('qntd')), 'quantidadeProdutosVendidos']
            ],
            where: {
                pedido_id: {
                    [Op.in]: (await Pedido.findAll({
                        where: {
                            empresa_id: empresaId,
                            created_at: {
                                [Op.between]: [dataInicial, dataFinal]
                            }
                        },
                        attributes: ['id']
                    })).map(pedido => pedido.id)
                }
            }
        });

        // Contagem de pedidos em trânsito
        const pedidosEmTransito = await Pedido.count({
            where: {
                empresa_id: empresaId,
                status: 'Enviado',
                created_at: {
                    [Op.between]: [dataInicial, dataFinal]
                }
            }
        });

        // Extrair os resultados
        const valorTotalVendas = parseFloat(formatarNumero(resumo?.dataValues.valorTotalVendas || 0));
        const quantidadePedidos = parseInt(resumo?.dataValues.quantidadePedidos || 0, 10);
        const quantidadeProdutos = parseInt(quantidadeProdutosVendidos[0]?.dataValues.quantidadeProdutosVendidos || 0, 10);

        return {
            valorTotalVendas,
            quantidadePedidos,
            quantidadeProdutosVendidos: quantidadeProdutos,
            pedidosEmTransito
        };
    } catch (error) {
        console.error('Erro ao buscar resumo das vendas:', error);
        throw error;
    }
}


module.exports = { getVendaMensalPorEmpresa, getVendaPorDiaDaSemana, getQuantidadeVendasPorDiaDaSemana, getTicketMedioPorDiaDaSemana, getResumoVendas };