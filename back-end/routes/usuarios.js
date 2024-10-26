const express = require('express')
const Usuario = require('../models/Usuario')
const Empresa = require('../models/Empresa')
const router = express.Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { capitalizarPrimeiraLetra, capitalizarTexto, coletarUsuarioID } = require('../utils/utils')
const crypto = require('crypto');

const validateUser = [
    check('nome').notEmpty().withMessage('Nome invalido!'),
    check('sobrenome').notEmpty().withMessage('Sobrenome invalido!'),
    check('email').notEmpty().withMessage('Endereço invalido!'),
    check('permissao').notEmpty().withMessage('Numero do endereço invalido!')
];

router.get('/cadastro', (req, res) => {
    res.render('usuarios/cadastrouser')
})
router.post('/cadastro', async (req, res) => {
    const { nome, sobrenome, email, senha, confirmarSenha, permissao, empresas } = req.body;

    // Validação de Empresas
    if (!empresas || empresas.length === 0) {
        return res.status(400).json({ message: "Empresa inválida ou vazia" });
    }

    // Validações de Campos Obrigatórios
    if (!nome) return res.status(400).json({ message: "Nome inválido ou vazio" });
    if (!sobrenome) return res.status(400).json({ message: "Sobrenome inválido ou vazio" });
    if (!email) return res.status(400).json({ message: "Email inválido ou vazio" });

    // Verifica se as senhas coincidem
    if (!senha || senha.length < 5) {
        return res.status(400).json({ message: "Senha inválida ou muito curta" });
    }
    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: "A senha e a confirmação não coincidem" });
    }

    if (!permissao) return res.status(400).json({ message: "Permissão inválida ou vazia" });

    try {
        // Verifica se o email já está em uso
        const userExist = await Usuario.findOne({ where: { email: email.toLowerCase(), ativo: 1 } });
        if (userExist) {
            return res.status(409).json({ message: "Já existe um usuário com este e-mail" });
        }

        // Geração do hash da senha e do código de recuperação
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);
        const recoveryCode = crypto.randomBytes(3).toString('hex'); // Código com 6 caracteres hexadecimais

        // Criação do novo usuário
        const newUser = await Usuario.create({
            nome: capitalizarTexto(nome),
            sobrenome: capitalizarTexto(sobrenome),
            email: email.toLowerCase(),
            senha: senhaHash,
            permissao,
            recovery_code: recoveryCode,
        });

        // Relaciona o usuário com empresas, se houver
        if (empresas.length > 0) {
            const empresasId = empresas.map(empresa => empresa.id);
            await newUser.setEmpresa(empresasId);
        }

        // Retorna resposta com o recovery code
        return res.status(201).json({ 
            message: "Usuário criado com sucesso", 
            recovery_code: recoveryCode 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocorreu um erro ao criar o usuário" });
    }
});

router.get('/listar', async (req, res) => {

    try {
        const usuarios = await Usuario.findAll({
            where: {
                ativo: true
            },
            include: [
                {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['id', 'razao_social'],
                    through: { attributes: [] }
                }
            ],
            attributes: { exclude: ['senha'] }
        })

        if (!usuarios) {
            return res.status(404).json({ message: "Nenhum usuario encontrado" })
        }

        const usuariosJSON = usuarios.map(usuario => {
            const usuarioData = usuario.toJSON();
            const empresas = usuario.empresa.map(empresa => ({
                id: empresa.id,
                razao_social: empresa.razao_social
            }))
            return {
                id: usuarioData.id,
                nome: usuarioData.nome,
                sobrenome: usuarioData.sobrenome,
                email: usuarioData.email,
                permissao: usuarioData.permissao,
                empresas: empresas
            }
        })
        return res.status(200).json(usuariosJSON)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar os usuarios' })
    }
})

router.get('/listar/empresa', async (req, res) => {
    try {
        const userId = coletarUsuarioID(req)

        const usuario = await Usuario.findByPk(userId, {
            include: [
                {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['id', 'razao_social'],
                    where: { ativo: true },
                    through: { attributes: [] },
                },
                {
                    model: Empresa,
                    as: 'empresaPrincipal',
                    attributes: ['id'],
                },
            ],
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const empresasJSON = usuario.empresa.map(empresa => {
            const empresasData = empresa.toJSON();

            const empresaFormatted = {
                id: empresasData.id,
                razao_social: empresasData.razao_social
            }

            return empresaFormatted;;
        })

        const response = {
            empresas: empresasJSON,
            empresaPrincipalId: usuario.empresaPrincipal
                ? usuario.empresaPrincipal.id 
                : null,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar os dados do usuario' })
    }

})

router.put('/editar', validateUser, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg })
    }

    const { id, nome, sobrenome, email, permissao, empresas } = req.body

    if (empresas.length == 0) {
        return res.status(400).json({ message: 'Empresas invalidas' })
    }

    try {
        let exisingUser = await Usuario.findOne({
            where: {
                id: { [Op.ne]: id },
                email: email
            }
        })

        if (exisingUser) {
            return res.status(400).json({ message: 'E-mail ja cadastrado por outro usuario' })
        }

        await Usuario.update(
            { nome: nome, sobrenome: sobrenome, email: email, permissao: Number(permissao) },
            { where: { id: id } }
        );

        const usuario = await Usuario.findByPk(id)
        if (usuario) {
            await usuario.setEmpresa(empresas.map(empresa => empresa.id))
        }

        return res.status(200).json({ message: 'Usuario editado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ocorreu um erro ao editar o usuario' })
    }

})



router.put('/empresa-principal', async (req, res) => {
    try {
        const { empresa_id } = req.body;
        const userId = coletarUsuarioID(req);

        const usuario = await Usuario.findByPk(userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        usuario.empresa_principal = empresa_id;
        await usuario.save();

        res.status(200).json({ message: 'Empresa principal definida com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao definir a empresa principal' });
    }
});

router.post('/deletar', async (req, res) => {
    try {
        const deleteUserID = req.body.id
        const result = await Usuario.update(
            { ativo: false },
            { where: { id: deleteUserID } }
        )
        if (result[0] === 0) {
            res.status(400).json({ message: "Usuario não encontrado" })
        }
        return res.status(200).json({ message: 'Usuario deletado com sucesso' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao deletar o usuario' })
    }
})
module.exports = router