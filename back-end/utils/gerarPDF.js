const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Empresa = require('../models/Empresa');
const Produto = require('../models/Produto');
const Pagamento = require('../models/Pagamento');
const Embalagem = require('../models/Embalagem');
const EtiquetaEnvio = require('../models/EtiquetaEnvio');
const ProdutoPedido = require('../models/ProdutoPedido');
const PDFdocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const { formatarData, formatarMoeda } = require('./utils');
const PagamentoPedido = require('../models/PagamentoPedido');

function base64ToBuffer(base64String) {
    // Remover o prefixo 'data:image/png;base64,' ou outro tipo de conteúdo
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer;
}

async function gerarPDF(pedidoId, res, assinatura) {
    try {
        // Busca o pedido com todas as associações
        const pedido = await Pedido.findOne({
            where: { id: pedidoId },
            include: [
                {
                    model: Cliente,
                    as: 'clientes',
                    attributes: ['nome', 'sobrenome', 'endereco', 'cep', 'telefone', 'cpf', 'numero', 'bairro', 'uf', 'complemento']
                },
                {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['razao_social', 'cnpj', 'endereco', 'telefone', 'image', 'telefone', 'email']
                },
                {
                    model: PagamentoPedido,
                    as: 'pagamento_pedido',
                    include: {
                        model: Pagamento,
                        as: 'pagamentos'
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
            ]
        });

        if (!pedido) {
            throw new Error('Pedido não encontrado');
        }

        // Aqui você pode acessar todos os dados do pedido e começar a gerar o PDF
        console.log("Pedido:", pedido);
        console.log("Cliente:", pedido.clientes);
        console.log("Empresa:", pedido.empresa);
        console.log("Forma de Pagamento:", pedido.pagamento_pedido);
        console.log("Produtos:", pedido.produtos);

        const logoBase64 = pedido.empresa.image

        //Criando um novo documento PDF
        const doc = new PDFdocument()
        const stream = fs.createWriteStream('pedido.pdf');
        // Inicia o documento e define as configurações iniciais
        doc.pipe(stream);


        doc.page.margins = { top: 50, bottom: 50, left: 50, right: 50 };
        doc.font('Helvetica');
        doc.fontSize(10);

        function createCellWithLabel(label, value, x, y, width, height) {
            doc.text(label, x + 1.5, y + 2, { align: 'left' });
            doc.text(value, x + 2, y + 15, { align: 'left' });
            doc.rect(x, y, width, height).stroke();
        }

        function createCellWithLabelTitulo(label, value, x, y, width, height) {
            doc.text(label, x + 3, y + 6, { align: 'left' });
            doc.text(value, x + 5, y + 15, { align: 'left' });
            doc.rect(x, y, width, height).stroke();
        }

        function createCellWithLabelProduto(label, value, x, y, width, height) {
            doc.text(label, x + 3, y + 6, { align: 'left' });
            doc.text(value, x + 5, y + 15, { align: 'left' });
            doc.rect(x, y, width, height).stroke();
        }

        function createCellWithLabelTotal(label, value, x, y, width, height) {
            doc.text(label, x + 3, y + 2, { align: 'left' });
            doc.text(value, x + 5, y + 15, { align: 'left' });
            doc.rect(x, y, width, height).stroke();
        }

        function createBorderedCell(x, y, width, height) {
            doc.rect(x, y, width, height).stroke();
        }

        doc.text(pedido.empresa.razao_social, 50, 50, { align: 'left' });
        doc.text(`CNPJ:${pedido.empresa.cnpj}`, 150, 50, { align: 'left' });
        doc.text(`Tel: ${pedido.empresa.telefone}`, 50, 65, { align: 'left' });
        doc.text(`Email: ${pedido.empresa.email}`, 150, 65, { align: 'left' });

        //Imagem
        const imageX = 480; // Posição X da imagem
        const imageY = 35; // Posição Y da imagem
        const imagePath = base64ToBuffer(logoBase64)

        // Verifica se o arquivo da imagem existe
        if (imagePath) {
            doc.image(imagePath, imageX, imageY, { width: 60 });
        }

        const destinatarioHeight = 20;
        const destinatarioY = 80;
        const destinatarioX = 50;
        const espacoVertical = 10;
        const novaPosicaoY = destinatarioY + destinatarioHeight + espacoVertical;

        doc.y = novaPosicaoY;

        const nomeY = novaPosicaoY;
        const nomeWidth = 200;
        const nomeHeight = 28;

        doc.text('Destinatário/Remetente', destinatarioX, novaPosicaoY - 12, { align: 'left' });
        doc.text(`Pedido ${pedido.id} /`, destinatarioX + 330, novaPosicaoY - 12, { align: 'left' });
        doc.text(`Emissão ${formatarData(pedido.createdAt)}`, destinatarioX + 385, novaPosicaoY - 12, { align: 'left' });
        createCellWithLabel('Nome', `${pedido.clientes.nome} ${pedido.clientes.sobrenome}`, destinatarioX, nomeY, nomeWidth, nomeHeight);
        createCellWithLabel('Telefone', `${pedido.clientes.telefone}`, destinatarioX + 200, nomeY, 130, nomeHeight);
        createCellWithLabel('CPF', `${pedido.clientes.cpf}`, destinatarioX + 330, nomeY, 170, nomeHeight);
        createCellWithLabel('Endereço', `${pedido.clientes.endereco}`, destinatarioX, nomeY + 30, 330, nomeHeight);
        createCellWithLabel('Número', `${pedido.clientes.numero}`, destinatarioX + 330, nomeY + 30, 170, nomeHeight);
        createCellWithLabel('Bairro', `${pedido.clientes.bairro}`, destinatarioX, nomeY + 60, 260, nomeHeight);
        createCellWithLabel('CEP', `${pedido.clientes.cep}`, destinatarioX + 260, nomeY + 60, 140, nomeHeight);
        createCellWithLabel('UF', `${pedido.clientes.uf}`, destinatarioX + 400, nomeY + 60, 100, nomeHeight);
        if (!pedido.clientes.complemento || pedido.clientes.complemento == null || pedido.clientes.complemento == undefined) {
            createCellWithLabel('Complemento', ``, destinatarioX, nomeY + 90, 500, nomeHeight);
        } else {
            createCellWithLabel('Complemento', `${pedido.clientes.complemento}`, destinatarioX, nomeY + 90, 500, nomeHeight);
        }

        doc.text('Dados da Compra', destinatarioX, novaPosicaoY + 130, { align: 'left' });
        createCellWithLabel('Forma de Pgto:', `${pedido.pagamento_pedido.pagamentos.nome}`, destinatarioX, novaPosicaoY + 141, 200, nomeHeight);
        if (pedido.pagamento_pedido.qntd_parcela > 1) {
            createCellWithLabel('Parcelas:', `${pedido.pagamento_pedido.qntd_parcela}`, destinatarioX + 200, novaPosicaoY + 141, 100, nomeHeight);
        } else {
            createCellWithLabel('Parcelas:', ``, destinatarioX + 200, novaPosicaoY + 141, 100, nomeHeight);
        }

        createCellWithLabel('Modo de Envio:', `${pedido.envio}`, destinatarioX + 300, novaPosicaoY + 141, 200, nomeHeight);

        const tituloX = destinatarioX;
        const tituloY = novaPosicaoY + 190;
        const tituloHeight = 20;

        // Definindo larguras das colunas
        const codWidth = 30;
        const produtoWidth = 150;
        const qtdWidth = 40;
        const valorUnitarioWidth = 100;
        const descontoWidth = 80;
        const valorTotalWidth = 100;
        const tituloWidth = codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth + valorTotalWidth;

        // Criando as células com os títulos
        createCellWithLabelTitulo('Cod', null, tituloX, tituloY, codWidth, tituloHeight);
        createCellWithLabelTitulo('Produto', null, tituloX + codWidth, tituloY, produtoWidth, tituloHeight);
        createCellWithLabelTitulo('Qtd', null, tituloX + codWidth + produtoWidth, tituloY, qtdWidth, tituloHeight);
        createCellWithLabelTitulo('Valor Unitário', null, tituloX + codWidth + produtoWidth + qtdWidth, tituloY, valorUnitarioWidth, tituloHeight);
        createCellWithLabelTitulo('Desconto', null, tituloX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth, tituloY, descontoWidth, tituloHeight);
        createCellWithLabelTitulo('Valor Total', null, tituloX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth, tituloY, valorTotalWidth, tituloHeight);

        // Definir variáveis para a posição dos produtos
        const produtosX = destinatarioX;
        const produtosY = novaPosicaoY + 215;
        const produtoHeight = 20;
        const espacoVerticalProdutos = 5;

        // Cria a borda para os produtos (largura ajustada para caber todas as colunas)
        createBorderedCell(produtosX, produtosY, tituloWidth, produtoHeight);

        // Cria as células para cada produto
        pedido.produtos.forEach((produto, index) => {
            const produtoX = produtosX;
            const produtoCellY = produtosY + index * (produtoHeight + espacoVerticalProdutos);

            // Extraindo os dados dos produtos
            const produtoId = produto.dataValues.id;
            const produtoNome = produto.dataValues.nome;
            const quantidade = produto.dataValues.produto_pedido.dataValues.qntd;
            const valorUnitario = produto.dataValues.produto_pedido.dataValues.vlr_uni;
            const desconto = produto.dataValues.produto_pedido.dataValues.vlr_desc;
            const valorTotal = (quantidade * valorUnitario) - desconto;

            // Criando células para cada campo
            createCellWithLabelProduto(produtoId, null, produtoX, produtoCellY, codWidth, produtoHeight);
            createCellWithLabelProduto(produtoNome, null, produtoX + codWidth, produtoCellY, produtoWidth, produtoHeight);
            createCellWithLabelProduto(quantidade, null, produtoX + codWidth + produtoWidth, produtoCellY, qtdWidth, produtoHeight);
            createCellWithLabelProduto(formatarMoeda(valorUnitario), null, produtoX + codWidth + produtoWidth + qtdWidth, produtoCellY, valorUnitarioWidth, produtoHeight);
            createCellWithLabelProduto(formatarMoeda(desconto), null, produtoX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth, produtoCellY, descontoWidth, produtoHeight);
            createCellWithLabelProduto(formatarMoeda(valorTotal), null, produtoX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth, produtoCellY, valorTotalWidth, produtoHeight);
        });

        // Exibindo o valor do frete e o valor total
        const freteY = produtosY + pedido.produtos.length * (produtoHeight + espacoVerticalProdutos + 2);
        let posicaoYAtual = freteY;

        // Posição dos totais à direita
        const totalResumosX = produtosX + tituloWidth - valorTotalWidth; // Ajuste para alinhar à direita

        // Exibir o valor do frete à direita
        createCellWithLabelTotal('Frete:', `${formatarMoeda(pedido.vlr_envio)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
        posicaoYAtual += produtoHeight + espacoVerticalProdutos;

        // Exibir o desconto, caso haja, à direita
        if (pedido.vlr_desc > 0) {
            createCellWithLabelTotal('Desconto:', `${formatarMoeda(pedido.vlr_desc)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
            posicaoYAtual += produtoHeight + espacoVerticalProdutos;
        }

        // Exibir a parcela ou o valor total diretamente à direita
        if (pedido.pagamento_pedido.qntd_parcela > 1) {
            const valorParcela = formatarMoeda(pedido.vlr_total / pedido.pagamento_pedido.qntd_parcela);
            createCellWithLabelTotal('Parcela:', `${valorParcela}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
            posicaoYAtual += produtoHeight + espacoVerticalProdutos;

            createCellWithLabelTotal('Valor Total:', `${formatarMoeda(pedido.vlr_total)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
        } else {
            createCellWithLabelTotal('Valor Total:', `${formatarMoeda(pedido.vlr_total)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
        }


        //PAGINA 2 COM ASSINATURA


        if (assinatura) {

            doc.addPage();

            function createCellWithLabel(label, value, x, y, width, height) {
                doc.text(label, x + 1.5, y + 2, { align: 'left' });
                doc.text(value, x + 2, y + 15, { align: 'left' });
                doc.rect(x, y, width, height).stroke();
            }

            function createCellWithLabelTitulo(label, value, x, y, width, height) {
                doc.text(label, x + 3, y + 6, { align: 'left' });
                doc.text(value, x + 5, y + 15, { align: 'left' });
                doc.rect(x, y, width, height).stroke();
            }

            function createCellWithLabelProduto(label, value, x, y, width, height) {
                doc.text(label, x + 3, y + 6, { align: 'left' });
                doc.text(value, x + 5, y + 15, { align: 'left' });
                doc.rect(x, y, width, height).stroke();
            }

            function createCellWithLabelTotal(label, value, x, y, width, height) {
                doc.text(label, x + 3, y + 2, { align: 'left' });
                doc.text(value, x + 5, y + 15, { align: 'left' });
                doc.rect(x, y, width, height).stroke();
            }

            function createBorderedCell(x, y, width, height) {
                doc.rect(x, y, width, height).stroke();
            }

            doc.text(pedido.empresa.razao_social, 50, 50, { align: 'left' });
            doc.text(`CNPJ:${pedido.empresa.cnpj}`, 150, 50, { align: 'left' });
            doc.text(`Tel: ${pedido.empresa.telefone}`, 50, 65, { align: 'left' });
            doc.text(`Email: ${pedido.empresa.email}`, 150, 65, { align: 'left' });

            //Imagem
            const imageX = 480; // Posição X da imagem
            const imageY = 35; // Posição Y da imagem
            const imagePath = base64ToBuffer(logoBase64)

            // Verifica se o arquivo da imagem existe
            if (imagePath) {
                doc.image(imagePath, imageX, imageY, { width: 60 });
            }

            const destinatarioHeight = 20;
            const destinatarioY = 80;
            const destinatarioX = 50;
            const espacoVertical = 10;
            const novaPosicaoY = destinatarioY + destinatarioHeight + espacoVertical;

            doc.y = novaPosicaoY;

            const nomeY = novaPosicaoY;
            const nomeWidth = 200;
            const nomeHeight = 28;

            doc.text('Destinatário/Remetente', destinatarioX, novaPosicaoY - 12, { align: 'left' });
            doc.text(`Pedido ${pedido.id} /`, destinatarioX + 330, novaPosicaoY - 12, { align: 'left' });
            doc.text(`Emissão ${formatarData(pedido.createdAt)}`, destinatarioX + 385, novaPosicaoY - 12, { align: 'left' });
            createCellWithLabel('Nome', `${pedido.clientes.nome} ${pedido.clientes.sobrenome}`, destinatarioX, nomeY, nomeWidth, nomeHeight);
            createCellWithLabel('Telefone', `${pedido.clientes.telefone}`, destinatarioX + 200, nomeY, 130, nomeHeight);
            createCellWithLabel('CPF', `${pedido.clientes.cpf}`, destinatarioX + 330, nomeY, 170, nomeHeight);
            createCellWithLabel('Endereço', `${pedido.clientes.endereco}`, destinatarioX, nomeY + 30, 330, nomeHeight);
            createCellWithLabel('Número', `${pedido.clientes.numero}`, destinatarioX + 330, nomeY + 30, 170, nomeHeight);
            createCellWithLabel('Bairro', `${pedido.clientes.bairro}`, destinatarioX, nomeY + 60, 260, nomeHeight);
            createCellWithLabel('CEP', `${pedido.clientes.cep}`, destinatarioX + 260, nomeY + 60, 140, nomeHeight);
            createCellWithLabel('UF', `${pedido.clientes.uf}`, destinatarioX + 400, nomeY + 60, 100, nomeHeight);
            if (!pedido.clientes.complemento || pedido.clientes.complemento == null || pedido.clientes.complemento == undefined) {
                createCellWithLabel('Complemento', ``, destinatarioX, nomeY + 90, 500, nomeHeight);
            } else {
                createCellWithLabel('Complemento', `${pedido.clientes.complemento}`, destinatarioX, nomeY + 90, 500, nomeHeight);
            }

            doc.text('Dados da Compra', destinatarioX, novaPosicaoY + 130, { align: 'left' });
            createCellWithLabel('Forma de Pgto:', `${pedido.pagamento_pedido.pagamentos.nome}`, destinatarioX, novaPosicaoY + 141, 200, nomeHeight);
            if (pedido.pagamento_pedido.qntd_parcela > 1) {
                createCellWithLabel('Parcelas:', `${pedido.pagamento_pedido.qntd_parcela}`, destinatarioX + 200, novaPosicaoY + 141, 100, nomeHeight);
            } else {
                createCellWithLabel('Parcelas:', ``, destinatarioX + 200, novaPosicaoY + 141, 100, nomeHeight);
            }

            createCellWithLabel('Modo de Envio:', `${pedido.envio}`, destinatarioX + 300, novaPosicaoY + 141, 200, nomeHeight);

            const tituloX = destinatarioX;
            const tituloY = novaPosicaoY + 190;
            const tituloHeight = 20;

            // Definindo larguras das colunas
            const codWidth = 30;
            const produtoWidth = 150;
            const qtdWidth = 40;
            const valorUnitarioWidth = 100;
            const descontoWidth = 80;
            const valorTotalWidth = 100;
            const tituloWidth = codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth + valorTotalWidth;

            // Criando as células com os títulos
            createCellWithLabelTitulo('Cod', null, tituloX, tituloY, codWidth, tituloHeight);
            createCellWithLabelTitulo('Produto', null, tituloX + codWidth, tituloY, produtoWidth, tituloHeight);
            createCellWithLabelTitulo('Qtd', null, tituloX + codWidth + produtoWidth, tituloY, qtdWidth, tituloHeight);
            createCellWithLabelTitulo('Valor Unitário', null, tituloX + codWidth + produtoWidth + qtdWidth, tituloY, valorUnitarioWidth, tituloHeight);
            createCellWithLabelTitulo('Desconto', null, tituloX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth, tituloY, descontoWidth, tituloHeight);
            createCellWithLabelTitulo('Valor Total', null, tituloX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth, tituloY, valorTotalWidth, tituloHeight);

            // Definir variáveis para a posição dos produtos
            const produtosX = destinatarioX;
            const produtosY = novaPosicaoY + 215;
            const produtoHeight = 20;
            const espacoVerticalProdutos = 5;

            // Cria a borda para os produtos (largura ajustada para caber todas as colunas)
            createBorderedCell(produtosX, produtosY, tituloWidth, produtoHeight);

            // Cria as células para cada produto
            pedido.produtos.forEach((produto, index) => {
                const produtoX = produtosX;
                const produtoCellY = produtosY + index * (produtoHeight + espacoVerticalProdutos);

                // Extraindo os dados dos produtos
                const produtoId = produto.dataValues.id;
                const produtoNome = produto.dataValues.nome;
                const quantidade = produto.dataValues.produto_pedido.dataValues.qntd;
                const valorUnitario = produto.dataValues.produto_pedido.dataValues.vlr_uni;
                const desconto = produto.dataValues.produto_pedido.dataValues.vlr_desc;
                const valorTotal = (quantidade * valorUnitario) - desconto;

                // Criando células para cada campo
                createCellWithLabelProduto(produtoId, null, produtoX, produtoCellY, codWidth, produtoHeight);
                createCellWithLabelProduto(produtoNome, null, produtoX + codWidth, produtoCellY, produtoWidth, produtoHeight);
                createCellWithLabelProduto(quantidade, null, produtoX + codWidth + produtoWidth, produtoCellY, qtdWidth, produtoHeight);
                createCellWithLabelProduto(formatarMoeda(valorUnitario), null, produtoX + codWidth + produtoWidth + qtdWidth, produtoCellY, valorUnitarioWidth, produtoHeight);
                createCellWithLabelProduto(formatarMoeda(desconto), null, produtoX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth, produtoCellY, descontoWidth, produtoHeight);
                createCellWithLabelProduto(formatarMoeda(valorTotal), null, produtoX + codWidth + produtoWidth + qtdWidth + valorUnitarioWidth + descontoWidth, produtoCellY, valorTotalWidth, produtoHeight);
            });

            // Exibindo o valor do frete e o valor total
            const freteY = produtosY + pedido.produtos.length * (produtoHeight + espacoVerticalProdutos + 2);
            let posicaoYAtual = freteY;

            // Posição dos totais à direita
            const totalResumosX = produtosX + tituloWidth - valorTotalWidth; // Ajuste para alinhar à direita

            // Exibir o valor do frete à direita
            createCellWithLabelTotal('Frete:', `${formatarMoeda(pedido.vlr_envio)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
            posicaoYAtual += produtoHeight + espacoVerticalProdutos;

            // Exibir o desconto, caso haja, à direita
            if (pedido.vlr_desc > 0) {
                createCellWithLabelTotal('Desconto:', `${formatarMoeda(pedido.vlr_desc)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
                posicaoYAtual += produtoHeight + espacoVerticalProdutos;
            }

            // Exibir a parcela ou o valor total diretamente à direita
            if (pedido.pagamento_pedido.qntd_parcela > 1) {
                const valorParcela = formatarMoeda(pedido.vlr_total / pedido.pagamento_pedido.qntd_parcela);
                createCellWithLabelTotal('Parcela:', `${valorParcela}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
                posicaoYAtual += produtoHeight + espacoVerticalProdutos;

                createCellWithLabelTotal('Valor Total:', `${formatarMoeda(pedido.vlr_total)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
            } else {
                createCellWithLabelTotal('Valor Total:', `${formatarMoeda(pedido.vlr_total)}`, totalResumosX, posicaoYAtual, valorTotalWidth, produtoHeight + 5);
            }

            doc.text('Assinatura', 50, 580, { align: 'left' });
            doc.moveTo(50, 610) // Coordenadas do ponto de partida
                .lineTo(550, 610) // Coordenadas do ponto de destino
                .stroke();
        }

        doc.end();

        // Evento de conclusão do stream
        stream.on('finish', () => {
            // Lê o arquivo PDF e envia como resposta de download
            fs.readFile(`Pedido.pdf`, (error, data) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao gerar o PDF');
                }
                // Define os cabeçalhos de resposta para abrir o PDF no navegador
                res.setHeader('Content-Disposition', `inline; filename="Pedido.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');

                // Envia o arquivo PDF como resposta
                res.send(data);
            });
        });
    }
    catch (error) {
        console.log("Erro: " + error)
        return error
    }
}

module.exports = {
    gerarPDF
}