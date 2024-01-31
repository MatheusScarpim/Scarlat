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
    let urlMod = `https://a184-2804-4ec-14e3-9200-b081-dddf-78de-694a.ngrok-free.app/api/v1/webhooks/atendimento/mensagens`
    console.log(params)
    axios.post(urlMod, params)
        .then((response: any) => {})
        .catch((error: any) => {});
}























const apiProtocolos = "https://a184-2804-4ec-14e3-9200-b081-dddf-78de-694a.ngrok-free.app/api/v1/webhooks/atendimento/conversas"

async function dispararProtocolos() {
    let retorno = await obterDadosProtocolos()
    console.log(retorno)
    
    axios.post(apiProtocolos, retorno)
        .then((response: any) => {})
        .catch((error: any) => {});
}

// setInterval(() => {
//     dispararProtocolos()
// }, 3000);


async function obterDadosProtocolos() {
    const db = await getClient();
    const collectionProtocolos = db.collection('PROTOCOLOS');
    let search: any = {
        status: "A",
    }

    const dataProtocolos = await collectionProtocolos.find(search).toArray();

    const resultados: any[] = [];

    await Promise.all(dataProtocolos.map(async (elemento, index) => {
        try {
            let messages: any = await getDataMessages(elemento._id.toHexString());

            const resultado = {
                conversationId: elemento._id.toHexString(),
                provider: elemento.provider,
                identifier: elemento.identifier,
                lastMessage: messages[messages.length - 1],
                operatorId: elemento.operatorId,
                name: elemento.name,
                status: elemento.status,
                countNotReads: contarNaoLidas(messages),
                photo: elemento.photo || null,
                dateCreated: elemento.dateCreated
            };

            resultados.push(resultado);
        } catch (error) {
            console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
        }
    }));

    return resultados
}

function contarNaoLidas(array: any) {
    let naoLidas = 0;

    for (let i = 0; i < array.length; i++) {
        if (!array[i].read) {
            naoLidas++;
        }
    }

    return naoLidas;
}


function getDataMessages(conversationId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('MENSAGENS');
            const data: any = await collection.find({
                "conversationId": new BSON.ObjectId(conversationId)
            }).toArray();
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports.dispararHook = dispararHook