const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const Empresa = require('../models/Empresa')
const { Sequelize, where } = require('sequelize')
const { Op } = require('sequelize')
const { capitalizarPrimeiraLetra, capitalizarTexto, coletarUsuarioID } = require('../utils/utils') 

const validateEmpresa = [
    check('razao_social').notEmpty().withMessage('Nome invalido!'),
    check('cnpj').isLength({ min: 18 }).withMessage('CNPJ invalido!'),
    check('telefone').isLength({ min: 10 }).withMessage('Telefone invalido!'),
    check('email').notEmpty().withMessage('E-mail invalido'),
    check('endereco.endereco').notEmpty().withMessage('Endereço invalido!'),
    check('endereco.numero').notEmpty().withMessage('Numero do endereço invalido!'),
    check('endereco.bairro').notEmpty().withMessage('Bairro invalido!'),
    check('endereco.cidade').notEmpty().withMessage('Cidade invalido!'),
    check('endereco.cep').notEmpty().withMessage('CEP invalido!'),
    check('endereco.uf').notEmpty().withMessage('Estado invalido!')
]
router.post('/cadastro', validateEmpresa ,async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const {razao_social, cnpj, telefone, email, endereco, image} = req.body
    
    try{
        let existingEmpresa = await Empresa.findOne({
            where: {
                [Op.or]: [
                    {cnpj},
                    {telefone},
                    {email}
                ],
                ativo: true
            }
        })

        if(existingEmpresa){
            if (existingEmpresa.telefone === telefone) {
                return res.status(400).json({ message: 'Telefone já cadastrado!' });
            }
            if (existingEmpresa.email === email) {
                return res.status(400).json({ message: 'E-mail já cadastrado!' });
            }
            if (existingEmpresa.cnpj === cnpj) {
                return res.status(400).json({ message: 'CNPJ já cadastrado!' });
            }
        }

        await Empresa.create({
            razao_social: capitalizarTexto(razao_social),
            cnpj: cnpj,
            telefone: telefone,
            email: email.toLowerCase(),
            endereco: capitalizarTexto(endereco.endereco),
            numero: endereco.numero,
            bairro: capitalizarTexto(endereco.bairro),
            cidade: capitalizarTexto(endereco.cidade),
            cep: endereco.cep,
            uf: endereco.uf.toUpperCase(),
            complemento: endereco.complemento ? capitalizarPrimeiraLetra(endereco.complemento): null,
            image,
            ativo: true,
        });
        res.status(201).json({ message: 'Empresa cadastrada com sucesso!' });

    }catch(error){
        console.error(error)
        res.status(500).json({message: 'Erro no servidor'})
    }
})

router.get('/listar', async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            where: {
                ativo: true
            }
        })

        const empresasJSON = empresas.map(empresa => {
            const empresasData = empresa.toJSON();

            const empresaFormatted = {
                id: empresasData.id,
                razao_social: empresasData.razao_social,
                cnpj: empresasData.cnpj,
                telefone: empresasData.telefone,
                email: empresasData.email,
                endereco: {
                    endereco: empresasData.endereco,
                    numero: empresasData.numero,
                    bairro: empresasData.bairro,
                    cidade: empresasData.cidade,
                    cep: empresasData.cep,
                    uf: empresasData.uf,
                    complemento: empresasData.complemento
                },
                image: empresasData.image,
                ativo: empresasData.ativo
            }

            return empresaFormatted;;
        })

        res.status(200).json(empresasJSON)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao listar as empresas' })
    }
})
router.get('/localizar/:empresaID', async (req, res) => {
    const empresaID = req.params.empresaID
    try {
        const empresas = await Empresa.findByPk(empresaID)

            const empresasData = empresas.toJSON();

            const empresaFormatted = {
                id: empresasData.id,
                razao_social: empresasData.razao_social,
                cnpj: empresasData.cnpj,
                telefone: empresasData.telefone,
                email: empresasData.email,
                endereco: {
                    endereco: empresasData.endereco,
                    numero: empresasData.numero,
                    bairro: empresasData.bairro,
                    cidade: empresasData.cidade,
                    cep: empresasData.cep,
                    uf: empresasData.uf,
                    complemento: empresasData.complemento
                },
                image: empresasData.image,
                ativo: empresasData.ativo
            }
    
        res.status(200).json(empresaFormatted)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao localizar a empresa' })
    }
})


router.get('/listar/razao-social', async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            where: {
                ativo: true
            }
        })

        const empresasJSON = empresas.map(empresa => {
            const empresasData = empresa.toJSON();

            const empresaFormatted = {
                id: empresasData.id,
                razao_social: empresasData.razao_social
            }

            return empresaFormatted;;
        })

        res.status(200).json(empresasJSON)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao listar as empresas' })
    }
})


router.put('/editar', validateEmpresa, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { id, razao_social, cnpj, telefone, email, endereco, image } = req.body

    try{
        
        let existingEmpresa = await Empresa.findOne({
            where: {
                id: {[Op.ne]: id},
                [Op.or]: [
                    {telefone: telefone},
                    {email: email},
                    {cnpj: cnpj}
                ],
                ativo: true
            }
        })
        if(existingEmpresa){
            if (existingEmpresa.telefone === telefone) {
                return res.status(400).json({ message: 'Telefone já cadastrado!' });
            }
            if (existingEmpresa.email === email) {
                return res.status(400).json({ message: 'E-mail já cadastrado!' });
            }
            if (existingEmpresa.cnpj === cnpj) {
                return res.status(400).json({ message: 'CNPJ já cadastrado!' });
            }
        }
        await Empresa.update({
            razao_social: capitalizarTexto(razao_social),
            cnpj: cnpj,
            telefone: telefone,
            email: email.toLowerCase(),
            endereco: capitalizarTexto(endereco.endereco),
            numero: endereco.numero,
            bairro: capitalizarTexto(endereco.bairro),
            cidade: capitalizarTexto(endereco.cidade),
            cep: endereco.cep,
            uf: endereco.uf.toUpperCase(),
            complemento: endereco.complemento ? capitalizarPrimeiraLetra(endereco.complemento): null,
            image,
            ativo: true,
        }, {where: {id}})
        return res.status(200).json({message: 'Dados atualizado com sucesso'})
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao editar a empresa' })
    }
})

router.post('/deletar', async (req,res) => {
    try{
        const deleteId = req.body.id
        const empresa = await Empresa.update(
            {
                ativo: false
            },{
                where: {
                    id: deleteId
                }
            }
        )

        if(empresa[0] === 0){
            return res.status(400).json({ message: 'Empresa não encontrada' })
        }

        return res.status(200).json({ message: 'Empresa deletada com sucesso' })
    } catch (error){
        return res.status(500).json({message: "Erro ao deletar a empresa"})
    }
})

module.exports = router