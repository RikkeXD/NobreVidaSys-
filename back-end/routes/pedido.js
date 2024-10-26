const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const Empresa = require('../models/Empresa');
const Usuario = require('../models/Usuario');
const Embalagem = require('../models/Embalagem');
const PagamentoPedido = require('../models/PagamentoPedido');
const EtiquetaEnvio = require('../models/EtiquetaEnvio');
const { where } = require('sequelize')
const { Op } = require('sequelize')
const { coletarUsuarioID, formatarData, capitalizarTexto } = require('../utils/utils');
const Pedido = require('../models/Pedido');
const ProdutoPedido = require('../models/ProdutoPedido')
const sequelize = require('../config/sequelize')
const { criarEtiqueta, consultarFrete } = require('./pexService')
const { gerarPDF } = require('../utils/gerarPDF');
const Cliente = require('../models/Cliente');
const Pagamentos = require('../models/Pagamento');
const Produto = require('../models/Produto');

const validatePedido = [
    check('empresa_id').notEmpty().withMessage('Empresa invalido!'),
    check('cliente_id').notEmpty().withMessage('Cliente invalido!'),
    check('pagamento').notEmpty().withMessage('Forma de pagamento invalido!'),
    check('vlr_total').notEmpty().withMessage('Peso invalido!'),
    check('envio').notEmpty().withMessage('Envio invalido!'),
    check('produtos').notEmpty().withMessage('Produto invalido!'),
];

router.get('/listar/:empresaID', async (req, res) => {
    const empresaID = req.params.empresaID;

    if (!empresaID || empresaID === 'undefined') {
        return res.status(400).json({ message: 'Empresa não informada' });
    }

    try {
        const pedidos = await Pedido.findAll({
            where: { empresa_id: empresaID },
            attributes: ['id', 'createdAt', 'vlr_total', 'status','cod_rastreio'], 
            include: [
                {
                    model: Cliente,
                    as: 'clientes',
                    attributes: ['nome', 'sobrenome'],
                }
            ],
            order: [['createdAt', 'DESC']] 
        });

        const pedidosFormatados = pedidos.map(pedido => ({
            id: pedido.id,
            cliente: `${pedido.clientes.nome} ${pedido.clientes.sobrenome}`,
            data: formatarData(pedido.createdAt),
            vlr_total: pedido.vlr_total.toFixed(2), 
            cod_rastreio: pedido.cod_rastreio,
            status: pedido.status
        }));

        if (pedidos.length === 0) {
            return res.status(404).json({ message: 'Nenhum pedido encontrado para esta empresa' });
        }

        res.status(200).json(pedidosFormatados);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ message: 'Erro ao listar pedidos' });
    }
});

router.post('/criar', validatePedido, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const usuario_id = coletarUsuarioID(req);
    if (!usuario_id) {
        return res.status(401).json({ message: 'Usuario não autenticado!' });
    }

    const { empresa_id, cliente_id, embalagem_id, vlr_total, vlr_desc, envio,
        vlr_envio, cod_rastreio, produtos, pagamento } = req.body;

    const t = await sequelize.transaction();

    try {
        const pedido = await Pedido.create({
            usuario_id,
            empresa_id,
            cliente_id,
            pagamento_id: pagamento.id,
            embalagem_id,
            vlr_total,
            vlr_desc,
            envio: capitalizarTexto(envio),
            vlr_envio,
            status: "Criado",
            cod_rastreio
        }, { transaction: t })

        if (pagamento.qntd_parcela) {
            await PagamentoPedido.create({
                pedido_id: pedido.id,
                pagamento_id: pagamento.id,
                qntd_parcela: pagamento.qntd_parcela
            }, { transaction: t });
        }


        if (pedido && produtos && produtos.length > 0) {
            const produtosToInsert = produtos.map(produto => ({
                pedido_id: pedido.id,
                produto_id: produto.produto_id,
                qntd: produto.qntd,
                vlr_desc: produto.vlr_desc || 0,
                vlr_uni: produto.vlr_uni
            }));

            await ProdutoPedido.bulkCreate(produtosToInsert, { transaction: t });
        }

        let resultEtiqueta = {status: 'skip'}

        if (pedido.envio === 'Pex' || pedido.envio === 'Pex - Sedex' || pedido.envio === 'Pex - Pac') {
            resultEtiqueta = await criarEtiqueta(pedido.cliente_id, pedido.id)
            if (resultEtiqueta.status === 'success') {
                await EtiquetaEnvio.create({
                    pedido_id: pedido.id,
                    cod_rastreio: resultEtiqueta.rastreamento,
                    image: resultEtiqueta.qrcode
                }, { transaction: t });
            }
        }

        await t.commit();

        return res.status(201).json({ 
            message: 'Pedido criado com sucesso', 
            pedido_id: pedido.id,
            resultEtiqueta });                                  

    } catch (error) {
        console.error(error)
        await t.rollback();
        res.status(500).josn({ message: "Erro no servidor " })
    }
})

router.post('/pdf', async (req, res) => {
    const {pedido_id, assinatura} = req.body;
    try {
        await gerarPDF(pedido_id, res, assinatura); 
    } catch (error) {
        res.status(500).send('Erro ao gerar PDF');
    }
})

router.post('/frete', async (req, res) => {
    const { cliente_id, embalagem_id, peso } = req.body;
    
    try {
        const valoresFrete = await consultarFrete(cliente_id, embalagem_id, peso)

        if (valoresFrete.error) {
            return res.status(400).json({ error: valoresFrete.error });
        }

        res.status(200).json(valoresFrete.retorno);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ocorreu um erro ao consultar o frete' })
    }

})

router.post('/localizar', async (req, res) => {
    const { pedido_id } = req.body;
    
    if (!pedido_id) {
        return res.status(400).json({ message: "O ID do pedido é obrigatório." });
    }

    try {
        const pedido = await Pedido.findOne({
            where: { id: pedido_id },
            include: [
                {
                    model: Cliente,
                    as: 'clientes',
                    attributes: ['nome', 'sobrenome', 'endereco', 'cep', 'telefone', 'cpf', 'numero', 'bairro', 'uf', 'complemento','cidade']
                },
                {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['razao_social', 'cnpj', 'endereco', 'telefone', 'image', 'telefone', 'email']
                },
                {
                    model: PagamentoPedido,
                    as: 'pagamento_pedido',
                    attributes: ['qntd_parcela'],
                    include: {
                        model: Pagamentos,
                        as: 'pagamentos',
                        attributes: ['nome', 'qtd_parcela']
                    }
                },
                {
                    model: Produto,
                    as: 'produtos',
                    attributes: ['id', 'nome'],
                    through: {
                        model: ProdutoPedido,
                        attributes: ['qntd', 'vlr_uni', 'vlr_desc']
                    }
                },
                {
                    model: Embalagem,
                    as: 'embalagem',
                    attributes: ['nome']
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        const produtosFormatados = pedido.produtos.map((produto) => ({
            produto_id: produto.id,
            nome: produto.nome,
            qntd: produto.produto_pedido.qntd,
            vlr_uni: produto.produto_pedido.vlr_uni,
            vlr_desc: produto.produto_pedido.vlr_desc
        }));

        const clienteFormatado = {
            id: pedido.id,
            nome: pedido.clientes.nome,
            sobrenome: pedido.clientes.sobrenome,
            telefone: pedido.clientes.telefone,
            cpf: pedido.clientes.cpf || null,
            email: pedido.clientes.email || null,
            endereco: {
                cep: pedido.clientes.cep,
                endereco: pedido.clientes.endereco,
                numero: pedido.clientes.numero,
                bairro: pedido.clientes.bairro,
                uf: pedido.clientes.uf,
                cidade: pedido.clientes.cidade,
                complemento: pedido.clientes.complemento || null
            }
        };

        const PedidoFormatado = {
            empresa: pedido.empresa,
            cliente: clienteFormatado,
            produtos: produtosFormatados,
            pagamento: {
                nome: pedido.pagamento_pedido.pagamentos.nome,
                qntd_parcela: pedido.pagamento_pedido.qntd_parcela
            },
            embalagem: pedido.embalagem.nome,
            envio: pedido.envio,
            vlr_total: pedido.vlr_total,
            vlr_desc: pedido.vlr_desc,
            vlr_envio: pedido.vlr_envio,
            cod_rastreio: pedido.cod_rastreio
        }
        
        res.status(200).json(PedidoFormatado);

    } catch (error) {
        console.error('Erro ao buscar o pedido ', error)
        res.status(500).json({ message: "Erro no servidor." });
    }

})

router.put('/atualizar', async (req, res) => {
    const { pedido_id, cod_rastreio } = req.body;

    if (!pedido_id) {
        return res.status(400).json({ message: "O ID do pedido é obrigatório." });
    }

    try {
        const pedido = await Pedido.findByPk(pedido_id);

        if (!pedido) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        let novoStatus;
        switch (pedido.status) {
            case 'Criado':
                novoStatus = 'Enviado';
                break;
            case 'Enviado':
                novoStatus = 'Finalizado';
                break;
            case 'Finalizado':
                return res.status(400).json({ message: "O pedido já está finalizado e não pode ser alterado." });
            case 'Cancelado':
                return res.status(400).json({ message: "O pedido foi cancelado e não pode ser alterado." });
            default:
                return res.status(400).json({ message: "Status inválido." });
        }

        pedido.status = novoStatus;
        pedido.cod_rastreio = cod_rastreio;
        await pedido.save();

        return res.status(200).json({ message: `Status atualizado para ${novoStatus}.` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar o pedido.", error });
    }
});

router.delete('/cancelar/:id', async (req, res) => {
    const { id } = req.params;
        const userId = coletarUsuarioID(req);
        try {
            const usuario = await Usuario.findByPk(userId);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (usuario.permissao !== 0) {
                return res.status(403).json({ error: 'Permissão negada' });
            }

            const pedido = await Pedido.findByPk(id);

            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }
            await pedido.destroy();

            return res.status(200).json({ message: 'Pedido excluído com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir o pedido' });
        }
})


module.exports = router
