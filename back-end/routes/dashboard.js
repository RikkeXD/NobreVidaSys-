const express = require('express')
const { getVendaMensalPorEmpresa, getVendaPorDiaDaSemana, getQuantidadeVendasPorDiaDaSemana, getTicketMedioPorDiaDaSemana, getResumoVendas } = require('../utils/dasboard')
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        const {empresa_id, dataInicial, dataFinal} = req.body
        // Extrai o ano da data de início
        if (!empresa_id) {
            return res.status(404).json({ message: 'Empresa não encontrada' })
        }
        
        const anoInicio = new Date(dataInicial).getFullYear();

        const vendasMensais = await getVendaMensalPorEmpresa(empresa_id, anoInicio)

        const vendasDiarias = await getVendaPorDiaDaSemana(empresa_id, dataInicial,dataFinal)

       const qtdVendasDiarias = await getQuantidadeVendasPorDiaDaSemana(empresa_id,dataInicial,dataFinal)

       const ticketMedioDiario = await getTicketMedioPorDiaDaSemana(empresa_id,dataInicial,dataFinal)

       const resumoVendas = await getResumoVendas(empresa_id, dataInicial,dataFinal)

        res.status(200).json({ vendasMensais: vendasMensais, vendasDiarias: vendasDiarias, qtdVendasDiarias: qtdVendasDiarias, ticketMedioDiario:ticketMedioDiario, resumoVendas:resumoVendas })
    } catch (error) {
        console.error('Erro ao buscar os dados ', error)
        return res.status(500).json({ message: 'Erro interno do servidor' })
    }

})


module.exports = router