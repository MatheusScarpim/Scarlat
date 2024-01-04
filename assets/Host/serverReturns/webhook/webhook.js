const axios = require("axios")
const criarConexao = require('../../../DB/BancoDeDados');


let cachedClient = null;
let cachedDb = null;
let entradaCount = 0;
const MAX_ENTRADAS = 10;

const apiUrl = process.env.LINK_WEBHOOK_MENSAGENS;

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

// async function obterDadosProtocolos(status) {
//     let retorno = [];
//     const db = await obterCliente();
//     const collectionProtocolos = db.collection('PROTOCOLOS');

//     const dataProtocolos = await collectionProtocolos.find({
//         STATUS: status.toString(),
//     }).toArray();
//     const collectionMensagem = db.collection('MENSAGENS');

//     await Promise.all(dataProtocolos.map(async (elemento) => {
//         try {
//             let ultimaMensagem = await collectionMensagem.find({
//                 PROTOCOLO_ID: parseInt(elemento["_id"]),
//             }).sort({
//                 DATA_ENVIO: -1
//             }).limit(1).toArray();

//             if (ultimaMensagem.length > 0) {
//                 ultimaMensagem = ultimaMensagem[0];

//                 retorno.push({
//                     PROTOCOLO_ID: elemento["_id"],
//                     NOME: elemento["NOME"],
//                     FOTOPERFIL:
//                     NUMERO: elemento["NUMERO"],
//                     NAO_LIDAS: await collectionMensagem.countDocuments({
//                         PROTOCOLO_ID: parseInt(elemento["_id"]),
//                         LIDA: "false"
//                     }),
//                     DATA_CRIACAO: elemento["DATA_CRIACAO"],
//                     ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
//                     ULTIMA_MENSAGEM: ultimaMensagem.MENSAGEM
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
//         }
//     }));
//     retorno.sort((a, b) => b.NAO_LIDAS - a.NAO_LIDAS);
//     return retorno;
// }

function formatarNumero(numero) {
    const numeroSemPrefixo = numero.replace(/^55/, '').replace("@c.us", "");

    const ddd = numeroSemPrefixo.substring(0, 2);
    const primeiraParte = numeroSemPrefixo.substring(2, 7);
    const segundaParte = numeroSemPrefixo.substring(7);

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}

module.exports.dispararHook = dispararHook