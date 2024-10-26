const express = require('express')
app = express()
const bodyParser = require('body-parser') //Coletar os dados do HTML e transformar em JSON para manipulação
const flash = require('connect-flash') //Biblioteca para mensagens temporarias
const session = require('express-session') //Biblioteca para realizar configuração de sessão para a aplicação
const Sequelize = require('sequelize') //Sequelize Banco de Dados SQL
const path = require('path')//Realizar caminho padrão para alguns recursos
const usuarios = require('./routes/usuarios')//Importando as Rotas do usuario
const home = require('./routes/home')//Importando as Rotas do usuario
const clientes = require('./routes/clientes') //Importando as Rotas do cliente
const produtos = require('./routes/produtos')
const vendas = require('./routes/vendas')
const estoque = require("./routes/estoque")
const empresa = require('./routes/empresa')
const embalagem = require("./routes/embalagem")
const pedido = require('./routes/pedido')
const pagamento = require('./routes/pagamento')
const dashboard = require('./routes/dashboard')
const moment = require('moment') //Biblioteca para ajuda na formatação das Datas
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Usuario = require('./models/Usuario')
const Empresa = require('./models/Empresa')
const { serialize } = require('v8')
const task = require('./cron-tasks/task')


//Configurações
//Banco de Dados
require('./database')
//Configurando para utilizar JSON
app.use(express.json({ limit: '50mb' }))

// Public
app.use(express.static(path.join(__dirname, 'public')))
//Body-Parser
app.use(bodyParser.urlencoded({ limit: '950mb', extended: true }))
app.use(bodyParser.json({ limit: '950mb' }))

//Sessão 
app.use(session({
    secret: 'SaudeVida',
    resave: true,
    saveUninitialized: true
}))
//Flash (Mensagens Temporaria)
app.use(flash())
//MiddleWares
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})
//Rotas
app.post('/', async (req, res) => {

    const { email, password } = req.body

    console.log(req.body)

    if (email === 'usuario' && password === 'senha') {
        // Usuário e senha corretos, envie uma resposta de sucesso
        res.status(200).json({ mensagem: 'Login bem-sucedido!' });
    } else {
        // Usuário ou senha incorretos, envie uma resposta de erro
        res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
    }

    //res.render('usuarios/login', { hideNavBar: true })

    //const usuario = await Usuario.findOne({})

})

app.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário ativo com a empresa principal associada
        const usuario = await Usuario.findOne({
            where: { email, ativo: true }, // Garante que o usuário está ativo
            include: {
                model: Empresa,
                as: 'empresaPrincipal',
                attributes: ['razao_social'], // Apenas a razão social
            },
        });

        if (!usuario) {
            return res.status(404).json({message:"Usuário não encontrado ou inativo"});
        }

        let checkPassword = false;
        if (usuario.senha) {
            checkPassword = await bcrypt.compare(password, usuario.senha); // Descomente para bcrypt
        }

        if (!checkPassword) {
            return res.status(401).json({message:"Senha inválida"});
        }

        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                sobrenome: usuario.sobrenome,
                permissao: usuario.permissao,
            },
            secret,
            {expiresIn: '2h'}
        );

        req.session.token = token;

        // Pega a razão social da empresa principal, se existir
        const razaoSocial = usuario.empresaPrincipal
            ? usuario.empresaPrincipal.razao_social
            : null;

        // Retorna o token e a razão social da empresa principal
        res.status(200).json({
            token,
            id: usuario.id,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            permissao: usuario.permissao,
            empresaPrincipal: razaoSocial,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: "Erro no servidor"});
    }

})

app.put('/redefinir-senha', async (req, res) => {
    try {
        const { recovery_code, senha, confirmarSenha } = req.body;

        const usuario = await Usuario.findOne({ where: { recovery_code } });
        if (!usuario) {
            return res.status(400).json({ message: 'Código de recuperação inválido' });
        }

        if (!senha || senha.length < 5) {
            return res.status(400).json({ message: "Senha inválida ou muito curta" });
        }

        if (senha !== confirmarSenha) {
            return res.status(400).json({ message: "A senha e a confirmação não coincidem" });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);

        usuario.senha = senhaHash;
        await usuario.save();

        return res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao redefinir senha', error: error })
    }

});

function pass(req, res, next) {
    next()
}

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Não autenticado" });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token
    const secret = process.env.SECRET;

    try {
        const decoded = jwt.verify(token, secret); 
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Erro na autenticação:', err);
        return res.status(401).json({ message: "Erro na autenticação" });
    }
}


app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

//Importando Rotas
//app.use('/usuarios', checkToken,usuarios)
app.use('/usuario', checkToken, usuarios)
app.use('/home', checkToken, home)
app.use('/clientes', checkToken, clientes)
app.use('/produtos', checkToken, produtos)
app.use('/embalagem', checkToken, embalagem)
app.use('/vendas', checkToken, vendas)
app.use('/estoque', checkToken, estoque)
app.use('/empresa', checkToken, empresa)
app.use('/pedido', checkToken, pedido)
app.use('/pagamento', checkToken, pagamento)
app.use('/dashboard', checkToken, dashboard)

app.use(pass);
//app.use();

//Servidor

const port = 8081
app.listen(port, () => console.log(`Servidor iniciado na porta ${port}`))
