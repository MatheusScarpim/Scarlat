const axios = require('axios');
const criarConexao = require('../../DB/BancoDeDados.js');
const meuEmitter = require('../../../server')



let cachedClient = null;
let cachedDb = null;
let entradaCount = 0;
const MAX_ENTRADAS = 10;

const apiUrl = process.env.LINK_WEBHOOK_MENSAGENS

function dispararHook(params) {
    axios.post(apiUrl, params)
        .then((response) => {
            console.log('Resposta:', response.data);
        })
        .catch((error) => {
            console.error('Erro:', error.message);
        });
}

// const apiProtocolos = 'http://localhost:8080/protocolos'

// async function dispararProtocolos(params) {
//     let retorno = await obterDadosProtocolos("A")
//     axios.post(apiProtocolos, retorno)
//         .then((response) => {})
//         .catch((error) => {
//             console.error('Erro:', error);
//         });
// }

// setInterval(() => {
//     dispararProtocolos()
// }, 5000);

async function obterCliente() {
    if (!cachedClient || !cachedDb) {
        let client = await criarConexao.Client();
        cachedDb = client.db('ScarlatDataBase');
    }
    return cachedDb;
}

async function obterDadosProtocolos(status) {
    let retorno = [];
    const db = await obterCliente();
    const collectionProtocolos = db.collection('PROTOCOLOS');

    const dataProtocolos = await collectionProtocolos.find({
        STATUS: status.toString(),
    }).toArray();
    const collectionMensagem = db.collection('MENSAGENS');

    await Promise.all(dataProtocolos.map(async (elemento) => {
        try {
            let ultimaMensagem = await collectionMensagem.find({
                PROTOCOLO_ID: parseInt(elemento["_id"]),
            }).sort({
                DATA_ENVIO: -1
            }).limit(1).toArray();

            if (ultimaMensagem.length > 0) {
                ultimaMensagem = ultimaMensagem[0];

                retorno.push({
                    PROTOCOLO_ID: elemento["_id"],
                    NOME: elemento["NOME"],
                    FOTOPERFIL: elemento["FOTOPERFIL"] ? elemento["FOTOPERFIL"] : "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",
                    NUMERO: elemento["NUMERO"],
                    NAO_LIDAS: await collectionMensagem.countDocuments({
                        PROTOCOLO_ID: parseInt(elemento["_id"]),
                        LIDA: "false"
                    }),
                    DATA_CRIACAO: elemento["DATA_CRIACAO"],
                    ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
                    ULTIMA_MENSAGEM: ultimaMensagem.MENSAGEM
                });
            }
        } catch (error) {
            console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
        }
    }));
    retorno.sort((a, b) => b.NAO_LIDAS - a.NAO_LIDAS);
    return retorno;
}

function formatarNumero(numero) {
    const numeroSemPrefixo = numero.replace(/^55/, '').replace("@c.us", "");

    const ddd = numeroSemPrefixo.substring(0, 2);
    const primeiraParte = numeroSemPrefixo.substring(2, 7);
    const segundaParte = numeroSemPrefixo.substring(7);

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}

module.exports.dispararHook = dispararHook