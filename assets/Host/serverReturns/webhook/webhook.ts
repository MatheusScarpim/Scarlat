const axios = require("axios");
import {
    BSON
} from "mongodb";
import {
    getClient
} from "../../../database/dataBase";


// let cachedClient = null;
// let cachedDb = null;
// let entradaCount = 0;
// const MAX_ENTRADAS = 10;

const apiUrl = process.env.LINK_WEBHOOK_MENSAGENS;

function dispararHook(params: any) {
    let urlMod = `${apiUrl}/api/v1/atendimento/${params.conversationId}`
    console.log(params)
    // axios.post(urlMod, params)
    //     .then((response: any) => {})
    //     .catch((error: any) => {});
}

const apiProtocolos = apiUrl + '/protocolos'

async function dispararProtocolos() {
    let retorno = await obterDadosProtocolos()
    console.log(retorno)
    // axios.post(apiProtocolos, retorno)
    //     .then((response: any) => {})
    //     .catch((error: any) => {
    //     });
}

// setInterval(() => {
//     dispararProtocolos()
// }, 5000);


async function obterDadosProtocolos() {
    let retorno: any;
    const db = await getClient();
    const collectionProtocolos = db.collection('PROTOCOLOS');

    const dataProtocolos = await collectionProtocolos.find({
        status: "A",
    }).toArray();

    await Promise.all(dataProtocolos.map(async (elemento, index) => {
        try {
            let messages : any = await getDataMessages(elemento._id)

            retorno = {
                conversationId: elemento._id.toHexString(),
                provider: elemento.provider,
                identifier: elemento.identifier,
                lastMessage: messages[messages.length-1],
                operatorId: elemento.operatorId,
                name: elemento.name,
                status: elemento.status,
                countNotReads: contarNaoLidas(messages)
            }
        } catch (error) {
            console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
        }
    }));
    return retorno;
}

function contarNaoLidas(array: any) {
    let naoLidas = 0;

    for (let i = 0; i < array.length; i++) {
        if (!array[i].lida) {
            naoLidas++;
        }
    }

    return naoLidas;
}


async function getDataMessages(conversationId: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collectionMensagem = db.collection('MENSAGENS');

            let mensagens : any = await collectionMensagem.find({
                conversationId: conversationId
            }).toArray();
             mensagens = mensagens.map((obj : any) => ({
                ...obj,
                _id: obj._id.toHexString(),
                conversationId: obj.conversationId.toHexString()

              }));
              
            resolve(mensagens);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports.dispararHook = dispararHook