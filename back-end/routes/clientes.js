const express = require('express')
const router = express.Router()
const Cliente = require('../models/Cliente')
const { check, validationResult } = require('express-validator');
const { Sequelize } = require('sequelize')
const { Op } = require('sequelize')
const { capitalizarPrimeiraLetra, capitalizarTexto, coletarUsuarioID } = require('../utils/utils')
router.get('/cadastro', (req, res) => {
    res.render('clientes/cadastroclientes')
})
require('dotenv').config()
const jwt = require('jsonwebtoken');
const Empresa = require('../models/Empresa');
const Usuario = require('../models/Usuario');


const validateClient = [
    check('nome').notEmpty().withMessage('Nome invalido!'),
    check('sobrenome').notEmpty().withMessage('Sobrenome invalido!'),
    check('telefone').isLength({ min: 10 }).withMessage('Telefone invalido!'),
    check('endereco.endereco').notEmpty().withMessage('Endereço invalido!'),
    check('endereco.numero').notEmpty().withMessage('Numero do endereço invalido!'),
    check('endereco.bairro').notEmpty().withMessage('Bairro invalido!'),
    check('endereco.cidade').notEmpty().withMessage('Cidade invalido!'),
    check('endereco.cep').notEmpty().withMessage('CEP invalido!'),
    check('endereco.uf').notEmpty().withMessage('Estado invalido!')
];

router.get('/listar/:empresaID', async (req, res) => {
    const userId = coletarUsuarioID(req)
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
                model: Cliente,
                as:'clientes',
                where: {ativo: true},
                through: { attributes: [] },
                include: [{
                    model: Empresa,
                    as:'empresa',
                    attributes: ['id', 'razao_social'],
                    through: { attributes: [] }
                }]
            }]
        });

        if (!empresa) {
            return res.status(404).json({ message: 'Não há clientes vinculados a essa empresa' })
        }
        if (!empresa.clientes || empresa.clientes.length === 0) {
            return res.status(404).json({ message: 'Clientes não encontrados' })
        }

        const clientesJSON = empresa.clientes.map(cliente => {
            const clienteData = cliente.toJSON();
            const empresas = cliente.empresa.map(empresa => ({
                id: empresa.id,
                razao_social: empresa.razao_social
            }));

            const clienteFormatted = {
                id: clienteData.id,
                nome: clienteData.nome,
                sobrenome: clienteData.sobrenome,
                telefone: clienteData.telefone,
                cpf: clienteData.cpf,
                email: clienteData.email,
                empresas: empresas,
                endereco: {
                    cep: clienteData.cep,
                    endereco: clienteData.endereco,
                    numero: clienteData.numero,
                    bairro: clienteData.bairro,
                    uf: clienteData.uf,
                    cidade: clienteData.cidade,
                    complemento: clienteData.complemento,
                },
            };

            return clienteFormatted;
        });

        res.status(200).json(clientesJSON);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao listar os clientes' });
    }
});


router.post('/cadastro', validateClient, async (req, res) => {
    const { nome, sobrenome, telefone, email, cpf, endereco, empresas } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    if(empresas.length <= 0){
        return res.status(400).json({ message: 'Empresa não informada' });
    }

    try {
        const userId = coletarUsuarioID(req);

        let existingClient = await Cliente.findOne({
            where: {
                [Op.or]: [
                    { telefone: telefone },
                    { cpf:  {
                        [Op.and]: [
                            {[Op.eq]: email},
                            {[Op.ne]: ''}
                        ]
                    }
                    }
                ],
                id_usuario: userId,
                ativo: true
            }
        });

        if (!existingClient && email) {
            existingClient = await Cliente.findOne({
                where: {
                    email,
                    id_usuario: userId
                }
            });
        }

        if (existingClient) {
            if (existingClient.telefone === telefone) {
                return res.status(400).json({ message: 'Telefone já cadastrado!' });
            }
            if (existingClient.cpf === cpf) {
                return res.status(400).json({ message: 'CPF já cadastrado!' });
            }
            if (existingClient.email === email) {
                return res.status(400).json({ message: 'Email já cadastrado!' });
            }
        }

        const newClient = await Cliente.create({
            nome: capitalizarTexto(nome),
            sobrenome: capitalizarTexto(sobrenome),
            telefone,
            email: email.toLowerCase(),
            cpf,
            endereco: capitalizarTexto(endereco.endereco),
            numero: endereco.numero,
            bairro: capitalizarTexto(endereco.bairro),
            cidade: capitalizarTexto(endereco.cidade),
            cep: endereco.cep,
            uf: endereco.uf.toUpperCase(),
            complemento: endereco.complemento ? capitalizarPrimeiraLetra(endereco.complemento) : null,
            id_usuario: userId
        });

        if (empresas && empresas.length > 0) {
            const empresaId = empresas.map(empresa => empresa.id)
            await newClient.setEmpresa(empresaId)
        }

        res.status(201).json({ message: 'Cliente criado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


router.put('/editar', validateClient, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const userId = coletarUsuarioID(req)

    const { id, nome, sobrenome, telefone, email, cpf, endereco, empresas } = req.body;

    try {
        const empresasUsuario = await Empresa.findAll({
            include: [{
                model: Usuario,
                as: 'usuarios',
                where: { id: userId }
            }],
            attributes: ['id']
        });

        const empresaIds = empresasUsuario.map(empresa => empresa.id);

        let existingClient = await Cliente.findOne({
            where: {
                id: { [Op.ne]: id },
                [Op.or]: [
                    { telefone: telefone },
                    { email: {
                        [Op.and]: [
                            {[Op.eq]: email},
                            {[Op.ne]: ''}
                        ]
                    }},
                    { cpf: cpf }
                ],
                ativo: true
            }, 
            include: [{
                model: Empresa,
                as:'empresa',
                where: { id: empresaIds }
            }]
        });

        if (existingClient) {
            let conflictField = "";
            if (existingClient.telefone === telefone) {
                conflictField = "Telefone";
            } else if (existingClient.email === email) {
                conflictField = "Email";
            } else if (existingClient.cpf === cpf) {
                conflictField = "CPF";
            }

            return res.status(400).json({ message: `${conflictField} já cadastrado para outro cliente em uma das suas empresas` });
        }

        await Cliente.update(
            {
                nome: capitalizarTexto(nome),
                sobrenome: capitalizarTexto(sobrenome),
                telefone,
                email: email.toLowerCase(),
                cpf,
                endereco: capitalizarTexto(endereco.endereco),
                numero: endereco.numero,
                bairro: capitalizarTexto(endereco.bairro),
                complemento: endereco.complemento ? capitalizarPrimeiraLetra(endereco.complemento) : null,
                cidade: capitalizarTexto(endereco.cidade),
                cep: endereco.cep,
                uf: endereco.uf.toUpperCase()
            },
            { where: { id } }
        );

        const cliente = await Cliente.findByPk(id)
        if(cliente){
            await cliente.setEmpresa(empresas.map(empresa => empresa.id))
            return res.status(200).json({ message: "Cliente atualizado com sucesso" });
        }

        if(!cliente){
            return res.status(404).json({ message: "Erro ao atualizar o cliente" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Ocorreu um erro ao editar o cliente", error: err.message });
    }

})

router.post('/deletar', async (req, res) => {
    try {
        const deleteId = req.body.id;
        const result = await Cliente.update(
            { ativo: false },
            { where: { id: deleteId } }
        )
        if (result[0] === 0) {
            res.status(400).json({ message: "Cliente não encontrado" })
        }
        return res.status(200).json({ message: "Cliente deletado com sucesso" })
    } catch (err) {
        return res.status(500).json({ message: "Erro ao deletar o cliente" })
    }
})


module.exports = router