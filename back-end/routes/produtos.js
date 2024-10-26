const express = require('express')
const router = express.Router()
const Produto = require('../models/Produto')
const Entrada_Produto = require("../models/Entrada_Produto")
const Empresa = require('../models/Empresa');
const moment = require('moment')
const { where } = require('sequelize')
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const {coletarUsuarioID, capitalizarPrimeiraLetra, capitalizarTexto} = require('../utils/utils')
const Usuario = require('../models/Usuario');
const ProdutoEmpresa = require('../models/ProdutoEmpresa');

const validateProduct = [
    check('nome').notEmpty().withMessage('Nome invalido!'),
    check('fornecedor').notEmpty().withMessage('Fornecedor invalido!'),
    check('cod_barras').notEmpty().withMessage('Codigo de barras invalido!'),
    check('peso').notEmpty().withMessage('Peso invalido!'),
    check('empresas').notEmpty().withMessage('Empresas invalida!')
];

async function BuscarProdutos() {
    try {
        const produtos = await Produto.findAll({})
        const produtosJSON = produtos.map(produtosAll => produtosAll.toJSON())
        return produtosJSON
    } catch (err) {
        console.log("Erro na função BuscarProdutos", err)
        return []
    }
}

async function BuscarNomeProduto(id) {
    try {
        const produto = await Produto.findOne({ where: { id: id } })
        const nomeProduto = produto.nome
        return nomeProduto
    } catch (err) {
        console.log("ERRO na Função BuscarNomeProduto", err)
        return []
    }
}
router.get('/listar/:empresaID', async (req, res) => {
   const empresaID = req.params.empresaID

    if (!empresaID || empresaID === 'undefined') {
        return res.status(400).json({ message: 'Empresa não informada' })
    }

    try{
        const empresa = await Empresa.findByPk(empresaID, {
            include: [{
                model: Produto,
                as:'produtos',
                where: {ativo: true},
                through: { attributes: [] },
                include: [{
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['id', 'razao_social'],
                    through: {attributes:[]}
                }]
            }]
        })

        if (!empresa){
            return res.status(404).json({message: 'Não há produtos vinculados a essa empresa'})
        }

        const produtosJSON = empresa.produtos.map(produto => {
            const produtoData = produto.toJSON();
            const empresas = produto.empresa.map(empresa => ({
                id: empresa.id,
                razao_social: empresa.razao_social
            }))

            const produtoFormatted = {
                id: produtoData.id,
                nome: produtoData.nome,
                fornecedor: produtoData.fornecedor,
                cod_barras: produtoData.cod_barras,
                peso: produtoData.peso,
                empresas: empresas
            }
            return produtoFormatted
        })
        res.status(200).json(produtosJSON)
    }catch (error){
        console.error(error)
        res.status(500).json({ message: 'Erro ao listar os produtos' })
    }

})

router.post('/cadastro', validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { nome, cod_barras, peso, fornecedor, empresas } = req.body;
    try {
        const userId = coletarUsuarioID(req)

        const empresasUsuario = await Empresa.findAll({
            include: [{
                model: Usuario,
                as:'usuarios',
                where: {id: userId}
            }]
        })

        const empresaIds = empresasUsuario.map(empresa => empresa.id)

        let existingProduct = await Produto.findOne({
            where: {
                [Op.or]: [
                    {nome: nome},
                    {cod_barras: cod_barras},
                ],
                ativo: true
            },
            include: [{
                model: Empresa,
                as: 'empresa',
                where: {
                    id: empresaIds
                }
            }]
        })

        if (existingProduct) {
            if(existingProduct.cod_barras === cod_barras){
                return res.status(400).json({message: `Já existe um produto com esse codigo de barras !`})
            }
            if(existingProduct.nome === nome){
                return res.status(400).json({message: `Já existe um produto com esse nome !`})
            }
        }

        const newProduct = await Produto.create({
            nome: capitalizarTexto(nome),
            fornecedor: capitalizarTexto(fornecedor),
            cod_barras: cod_barras,
            peso: peso,
        })

        if(empresas && empresas.length > 0){
            const empresasIDs = req.body.empresas.map(empresa => empresa.id)
            await newProduct.setEmpresa(empresasIDs)
        }

        return res.status(201).json({message: 'Produto criado com sucesso'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Erro no servidor'})
    }
})

router.put('/editar',validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { id, nome, cod_barras, peso, fornecedor, empresas } = req.body;

    try {
        const userId = coletarUsuarioID(req)

        const empresasUsuario = await Empresa.findAll({
            include: [{
                model: Usuario,
                as: 'usuarios',
                where: {id: userId}
            }],
            attributes: ['id']
        })

        const empresaIds = empresasUsuario.map(empresa => empresa.id)

        let existingProduct = await Produto.findOne({
            where: {
                id: {[Op.ne]: id},
                ativo: true,
                [Op.or]: [
                    {nome: nome},
                    {cod_barras: cod_barras},
                ],
            },
            include: [{
                model: Empresa,
                as: 'empresa',
                where: {id: empresaIds}
            }]
        })

        if (existingProduct) {
            if(existingProduct.cod_barras === cod_barras){
                return res.status(400).json({message: `Já existe um produto com esse codigo de barras !`})
            }
            if(existingProduct.nome === nome){
                return res.status(400).json({message: `Já existe um produto com esse nome !`})
            }
        }

        await Produto.update({
            nome: capitalizarTexto(nome),
            fornecedor: capitalizarTexto(fornecedor),
            cod_barras: cod_barras,
            peso: peso
        },{where: {id}}
    );

    const produto = await Produto.findByPk(id)
    if (produto){
        await produto.setEmpresa(empresas.map(empresa => empresa.id))
    }

    return res.status(200).json({message: 'Produto atualizado com sucesso'})

    } catch (error) {
        console.log(error)
        console.error('Erro no servidor')
    }

})

router.post('/editprod', async (req, res) => {

    var erros = []
    const produtos = req.body
    const { nome, fornecedor, cod_barras } = req.body
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome vazio ou invalido' })
    }
    if (!req.body.fornecedor || typeof req.body.fornecedor == undefined || req.body.fornecedor == null) {
        erros.push({ texto: 'Fornecedor vazio ou invalido' })
    }
    if (erros.length > 0) {
        console.log(erros)
        res.render('produtos/editprod', { erros: erros, produto: produtos })
    } else {
        const update = await Produto.update({
            nome: req.body.nome,
            fornecedor: req.body.fornecedor,
            cod_barras: req.body.cod_barras
        }, { where: { id: req.body.id } }).then(() => {
            req.flash('success_msg', 'Produto alterado com sucesso!')
            res.redirect('/produtos')
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Erro ao alterar o produto')
            res.redirect('/produtos')
        })
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

        const result = await Produto.update(
            {ativo: false},
            {where: {id: deleteId}}
        )
        if(result[0] === 0){
            res.status(400).json({message: 'Produto não encontrado'})
        }
        
        return res.status(200).json({message: 'Produto deletado com sucesso'})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao deletar o produto'})
    }
})

// Entrada de Produtos
router.get('/entrada', async (req, res) => {
    try {
        const entradas = await Entrada_Produto.findAll({})
        const entradasJSON = entradas.map(entrada => entrada.toJSON())
        let ArrayEntradas = []
        for (const entrada of entradasJSON) {
            const id = entrada.id
            const produto = await BuscarNomeProduto(entrada.produto_id)
            const fornecedor = entrada.fornecedor
            const num_nota = entrada.num_nota == null ? "Sem informação" : entrada.num_nota
            const qntd_produto = entrada.qntd_produto

            //Formantando a Data
            const data = moment(entrada.createAt).format('DD/MM/YYYY')

            //Formatando Valor Total
            const vlr_total = `R$ ${entrada.vlr_total.toFixed(2).replace('.', ',')}`

            ArrayEntradas.push({
                id: id,
                produto: produto,
                fornecedor: fornecedor,
                num_nota: num_nota,
                qntd_produto: qntd_produto,
                vlr_total: vlr_total,
                data: data
            })
        }
        const AllEntradas = JSON.stringify(ArrayEntradas)
        console.log(AllEntradas)
        res.render('produtos/entradaprod', { entrada: ArrayEntradas })
    } catch (err) {
        console.log("Erro Rota /entrada", err)
    }

})

//Deletar Entrada
router.post('/entrada/deletar', async (req, res) => {
    const DeletarEntrada = await Entrada_Produto.destroy({ where: { id: req.body.id } }).then(() => {
        req.flash('success_msg', 'Entrada deletada com sucesso! ')
        res.redirect('/produtos/entrada')
    }).catch((err) => {
        req.flash('error_msg', "Ocorreu um erro ao deletar a entrada")
        res.redirect("/produtos/entrada")
        console.log("Erro Rota Post /entrada/deletar >>> ", err)
    })
})

//Modificar Entrada
router.get('/entrada/edit/:id', async (req, res) => {
    try {
        const Entradas = await Entrada_Produto.findOne({ where: { id: req.params.id } })
        const EntradasJson = Entradas.toJSON()
        const produtos = await BuscarProdutos()
        console.log(EntradasJson)
        res.render("produtos/editentrada", { nota: EntradasJson, produto: produtos })
    } catch (err) {
        console.log(err)
    }
})

router.post('/produtos/entrada/edit', async (req, res) => {

    const nota = req.body
    const produtoId = parseInt(nota.produto);
    const vlrTotal = parseFloat(nota.vlr_total.replace('R$', '').replace('.', '').replace(',', '.'))
    const qntdProdutos = parseInt(nota.qntd_produtos);

    var erro = []
    if (!nota.produto || typeof nota.produto == undefined || nota.produto == null) {
        erro.push({ texto: "Produto Invalido ou não selecionado" })
    }
    if (!nota.fornecedor || typeof nota.fornecedor == undefined || nota.fornecedor == null) {
        erro.push({ texto: "Fornecedor Invalido ou vazio" })
    }
    if (!nota.vlr_total || typeof nota.vlr_total == undefined || nota.vlr_total == null) {
        erro.push({ texto: "Valor Invalido ou vazio" })
    }
    if (!nota.qntd_produtos || typeof nota.qntd_produtos == undefined || nota.qntd_produtos == null) {
        erro.push({ texto: "Quantidade de produtos Invalido ou vazio" })
    }
    const produtos = await BuscarProdutos()
    if (!produtos) {
        req.flash('error_msg', "Erro ao listar os produtos")
        res.redirect("/home")
    }

    if (erro.length > 0) {
        res.render('produtos/cadastroentrada', { erro: erro, nota: nota, produto: produtos })
    } else {
        const entrada = await Entrada_Produto.update({
            produto_id: produtoId,
            fornecedor: nota.fornecedor,
            num_nota: nota.n_nota,
            vlr_total: vlrTotal,
            qntd_produto: qntdProdutos
        }, {where: {id: nota.id}}).then(() =>{
            req.flash('sucess_msg', 'Alteração feita com sucesso!')
            res.redirect('/produtos/entrada')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao alterar entrada')
            res.redirect('/produtos/entrada')
        })
    }
})

//CADASTRO ENTRADA DE PRODUTOS
router.get('/entrada/cadastro', async (req, res) => {
    const produtos = await BuscarProdutos()
    if (!produtos) {
        req.flash('error_msg', "Erro ao listar os produtos")
        res.redirect("/home")
    }
    if (!produtos) {
        req.flash('error_msg', "Erro ao listar os produtos")
        res.redirect("/produtos/entrada")
    }
    res.render('produtos/cadastroentrada', { produto: produtos })
})



router.post('/entrada/cadastrar', async (req, res) => {
    const nota = req.body
    const produtoId = parseInt(nota.produto);
    const vlrTotal = parseFloat(nota.vlr_total.replace('R$', '').replace('.', '').replace(',', '.'));
    const qntdProdutos = parseInt(nota.qntd_produtos);

    var erro = []
    if (!nota.produto || typeof nota.produto == undefined || nota.produto == null) {
        erro.push({ texto: "Produto Invalido ou não selecionado" })
    }
    if (!nota.fornecedor || typeof nota.fornecedor == undefined || nota.fornecedor == null) {
        erro.push({ texto: "Fornecedor Invalido ou vazio" })
    }
    if (!nota.vlr_total || typeof nota.vlr_total == undefined || nota.vlr_total == null) {
        erro.push({ texto: "Valor Invalido ou vazio" })
    }
    if (!nota.qntd_produtos || typeof nota.qntd_produtos == undefined || nota.qntd_produtos == null) {
        erro.push({ texto: "Quantidade de produtos Invalido ou vazio" })
    }
    const produtos = await BuscarProdutos()
    if (!produtos) {
        req.flash('error_msg', "Erro ao listar os produtos")
        res.redirect("/home")
    }

    if (erro.length > 0) {
        res.render('produtos/cadastroentrada', { erro: erro, nota: nota, produto: produtos })
    } else {
        const entrada = await Entrada_Produto.create({
            produto_id: produtoId,
            fornecedor: nota.fornecedor,
            num_nota: nota.n_nota,
            vlr_total: vlrTotal,
            qntd_produto: qntdProdutos
        }).then(() => {
            req.flash("success_msg", "Entrada cadastrada com Sucesso! ")
            res.redirect("/produtos/entrada")
        }).catch((err) => {
            req.flash("erro_msg", "Ocorreu um erro ao cadastrar lançamento")
            res.redirect("/produtos/entrada")
            console.log("Erro: Rota Post /entrada/cadastrar", err)
        })
    }
})
module.exports = router