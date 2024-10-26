const jwt = require('jsonwebtoken')

function capitalizarTexto(str) {
    return str.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}

function capitalizarPrimeiraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function coletarUsuarioID(req){
    const token = req.headers['authorization'];
    const secret = process.env.Secret;
    const decodedToken = jwt.verify(token.split(' ')[1], secret);
    const userId = decodedToken.id;
    return userId;
}

function formatarData(data) {
    const dataOriginal = new Date(data);

    const dia = String(dataOriginal.getDate()).padStart(2, '0');
    const mes = String(dataOriginal.getMonth() + 1).padStart(2, '0');
    const ano = dataOriginal.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
    // Verifica se o valor é um número
    if (typeof valor !== 'number') {
        throw new Error('O valor deve ser um número');
    }

    // Formata o valor para duas casas decimais e substitui o ponto por vírgula
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

module.exports = {
    capitalizarTexto,
    capitalizarPrimeiraLetra,
    coletarUsuarioID,
    formatarData,
    formatarMoeda
 };


