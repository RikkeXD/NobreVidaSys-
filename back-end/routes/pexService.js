const axios = require('axios');
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Embalagem = require('../models/Embalagem');

const PEX_API_URL = 'https://pex.app.br/ws.exe';
const PEX_USER = 'saudeevida2022@gmail.com';
const PEX_PASSWORD = '123456';

async function criarEtiqueta(clienteID, pedidoID) {
    try {
        const cliente = await Cliente.findOne({
            where: { id: clienteID },
            attributes: ['nome', 'sobrenome', 'endereco', 'numero', 'complemento', 'bairro', 'cep', 'telefone']
        });

        if (!pedidoID) {
            throw new Error('Pedido não encontrado');
        }

        const requestBody = new URLSearchParams();
        requestBody.append('usuario', PEX_USER);
        requestBody.append('senha', PEX_PASSWORD);
        requestBody.append('tipo', '1');
        requestBody.append('numero_pedido', String(pedidoID));
        requestBody.append('destinatario', `${cliente.nome} ${cliente.sobrenome}`);
        requestBody.append('logradouro', cliente.endereco);
        requestBody.append('numero', cliente.numero);
        requestBody.append('complemento', cliente.complemento || '');
        requestBody.append('bairro', cliente.bairro);
        requestBody.append('cep', cliente.cep.replace('-', ''));
        requestBody.append('telefone', cliente.telefone);
        requestBody.append('valor_declarado', '0');

        const response = await axios.post(`${PEX_API_URL}/criar_etiqueta`, requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data.retorno && response.data.retorno[0] && response.data.retorno[0].erro) {
            return {
                status: 'error',
                message: response.data.retorno[0].erro
            }
        }

        let cleanedData = response.data;
        cleanedData = cleanedData.replace(/\r\n/g, '');
        const data = JSON.parse(cleanedData);

        return {
            status: 'success',
            rastreamento: data.retorno[0].rastreamento,
            qrcode: data.retorno[0].qrcode
        };
    } catch (error) {
        console.error(error.message);
        return {
            status: 'error',
            message: error.message
        }
    }
}

// Função para consultar o status de rastreamento
async function consultarStatus(codigosRastreio) {
    try {
        // Codifica múltiplos códigos de rastreamento concatenados com "&"
        const rastreamento = Array.isArray(codigosRastreio)
            ? codigosRastreio.join('&')
            : codigosRastreio;

        const requestBody = {
            rastreamento
        };

        // Fazendo a requisição POST para a API de consulta de status
        const response = await axios.post(`${PEX_API_URL}/status`, requestBody);

        // Retornando os dados do status dos objetos rastreados
        return response.data;
    } catch (error) {
        console.error(`Erro ao consultar status: ${error.message}`);
        throw error;
    }
}

async function consultarFrete( cliente_id, embalagem_id, peso) {
    try{

        const embalagem = await Embalagem.findOne({
            where: {
                id: embalagem_id,
                ativo: true
            }
        })

        const cliente = await Cliente.findOne({
            where: {
                id: cliente_id,
                ativo: true
            },
            attributes: ['cep']
        })

        const pesoTotal = peso + embalagem.peso

        const requestBody = new URLSearchParams();
        requestBody.append('email', PEX_USER);
        requestBody.append('senha', PEX_PASSWORD);
        requestBody.append('cep', cliente.cep.replace('-', ''));
        requestBody.append('valor_declarado', '0');
        requestBody.append('comprimento', embalagem.comprimento);
        requestBody.append('largura', embalagem.largura);
        requestBody.append('altura', embalagem.altura);
        requestBody.append('peso', pesoTotal);
       

        const response = await axios.post(`${PEX_API_URL}/consultar_frete_3`, requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data.retorno && response.data.retorno[0] && response.data.retorno[0].erro) {
            return {
                error: response.data.retorno[0].erro
            }
        }

        let cleanedData = response.data;
        cleanedData = cleanedData.replace(/\r\n/g, '').replace(/,\s*]/, ']');
        const data = JSON.parse(cleanedData);

        return data
    } catch (error) {
        console.error(`Erro ao consultar frete: ${error.message}`);
        return {error: error}
    }
}


module.exports = {
    criarEtiqueta,
    consultarStatus,
    consultarFrete
};
