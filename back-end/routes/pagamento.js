const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const Pagamento = require('../models/Pagamento');
const { where } = require('sequelize')
const { Op } = require('sequelize')
const sequelize = require('../config/sequelize')

const validatePedido = [
    check('Nome').notEmpty().withMessage('Nome invalido!'),
];

router.get('/listar', async (req, res) => {
    try {
        const pagamentos = await Pagamento.findAll({})
        const pagamentoJson = pagamentos.map(pagamento => {
            const pagamentoData = pagamento.toJSON();
            return {
                id: pagamentoData.id,
                nome: pagamentoData.nome
            }
        })

    return res.status(200).json(pagamentoJson);

} catch (error) {
    console.error(error)
    res.status(500).josn({ message: "Erro no servidor " })
}})


module.exports = router
