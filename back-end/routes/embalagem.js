const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const Empresa = require('../models/Empresa');
const Usuario = require('../models/Usuario');
const Embalagem = require('../models/Embalagem');
const { where } = require('sequelize')
const { Op } = require('sequelize')
const { coletarUsuarioID, capitalizarPrimeiraLetra, capitalizarTexto } = require('../utils/utils')

const validateEmbalagem = [
    check('nome').notEmpty().withMessage('Nome invalido!'),
    check('altura').notEmpty().withMessage('Altura invalido!'),
    check('comprimento').notEmpty().withMessage('Comprimento invalido!'),
    check('largura').notEmpty().withMessage('Largura invalido!'),
    check('peso').notEmpty().withMessage('Peso invalido!')
];

router.get('/listar/:empresaID', async (req, res) => {
    const empresaID = req.params.empresaID

    if (!empresaID || empresaID === 'undefined') {
        return res.status(400).json({ message: 'Empresa não informada' })
    }

    try {
        const empresa = await Empresa.findByPk(empresaID, {
            where: {
                ativo: true
            },
            include: [{
                model: Embalagem,
                as: 'embalagem',
                where: { ativo: true },
                through: { attributes: [] },
                include: [{
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['id', 'razao_social'],
                    through: { attributes: [] }
                }]
            }]
        });

        if (!empresa) {
            return res.status(404).json({ message: 'Não há embalagens vinculados a essa empresa' })
        }
        if (!empresa.embalagem || empresa.embalagem.length === 0) {
            return res.status(404).json({ message: 'Embalagens não encontrados' })
        }

        const embalagensJSON = empresa.embalagem.map(embalagem => {
            const embalagemData = embalagem.toJSON();
            const empresas = embalagem.empresa.map(empresa => ({
                id: empresa.id,
                razao_social: empresa.razao_social
            }));

            const embalagemFormatted = {
                id: embalagemData.id,
                nome: embalagemData.nome,
                altura: embalagemData.altura,
                largura: embalagemData.largura,
                comprimento: embalagemData.comprimento,
                peso: embalagemData.peso,
                empresas: empresas,
            };

            return embalagemFormatted;
        });

        res.status(200).json(embalagensJSON);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar as emabalagens' });
    }
});

router.post('/cadastro', validateEmbalagem, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { nome, altura, comprimento, largura, peso, empresas } = req.body;

    try {
        const userId = coletarUsuarioID(req)
        const empresasUsuarios = await Empresa.findAll({
            include: [{
                model: Usuario,
                as: 'usuarios',
                where: { id: userId }
            }]
        })

        const empresasIds = empresasUsuarios.map(empresa => empresa.id)

        let existingEmbalagem = await Embalagem.findOne({
            where: {
                nome: nome,
                ativo: true
            },
            include: [{
                model: Empresa,
                as: 'empresa',
                where: { id: empresasIds }
            }]
        })

        if (existingEmbalagem) {
            return res.status(400).json({ message: "Nome de embalagem já cadastrada!" })
        }

        const newEmbalagem = await Embalagem.create({
            nome: capitalizarTexto(nome),
            altura: altura,
            comprimento: comprimento,
            largura: largura,
            peso: peso,
        })

        if (empresas && empresas.length > 0) {
            const empresasIDs = empresas.map(empresa => empresa.id)
            await newEmbalagem.setEmpresa(empresasIDs)
        }

        return res.status(201).json({ message: 'Produto criado com sucesso' })

    } catch (error) {
        console.error(error)
        res.status(500).josn({ message: "Erro no servidor " })
    }
})

router.put('/editar', validateEmbalagem, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { id ,nome, altura, comprimento, largura, peso, empresas } = req.body;

    try {
        const userId = coletarUsuarioID(req)

        const empresasUsuario = await Empresa.findAll({
            include: [{
                model: Usuario,
                as: 'usuarios',
                where: { id: userId }
            }],
            attributes: ['id']
        })

        const empresaIds = empresasUsuario.map(empresa => empresa.id)

        let existingEmbalagem = await Embalagem.findOne({
            where: {
                id: { [Op.ne]: id },
                ativo: true,
                [Op.or]: [
                    { nome: nome },
                ],
            },
            include: [{
                model: Empresa,
                as: 'empresa',
                where: { id: empresaIds }
            }]
        })

        if (existingEmbalagem) {
            return res.status(400).json({ message: `Já existe uma embalagem com esse nome !` })
        }

        await Embalagem.update({
            nome: capitalizarTexto(nome),
            altura: altura,
            largura: largura,
            comprimento: comprimento,
            peso: peso
        }, { where: { id } }
        );

        const embalagem = await Embalagem.findByPk(id)
        if (embalagem) {
            await embalagem.setEmpresa(empresas.map(empresa => empresa.id))
        }

        return res.status(200).json({ message: 'Embalagem atualizado com sucesso' })

    } catch (error) {
        console.log(error)
        console.error('Erro no servidor')
    }

})

router.post('/deletar', async (req, res) => {
    try{
        const deleteId = req.body.id

        // Codigo para excluir todo o registro do id da tabela de associação

        // await ProdutoEmpresa.destroy({
        //     where: { produto_id: deleteId },
        //     hooks: false
        // });

        const result = await Embalagem.update(
            {ativo: false},
            {where: {id: deleteId}}
        )
        if(result[0] === 0){
            res.status(400).json({message: 'Embalagem não encontrado'})
        }
        
        return res.status(200).json({message: 'Embalagem deletado com sucesso'})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao deletar o Embalagem'})
    }
})

module.exports = router
