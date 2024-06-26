import express, {
    Request,
    Response
} from 'express';
import {
    getClient
} from "../../database/dataBase"

import {
    BSON
} from 'mongodb';

import {
    getExisting
} from '../../../modules/Conversations/generateConversations';


export async function getMessagesId(req: Request, res: Response) {
    let conversationId: any = req.query.conversationId;
    try {
        const dataConversation: any = await getDataConversation(conversationId);

        if (dataConversation) {

            const dadosMensagens: any = await getDataMessages(conversationId);

            if (dadosMensagens) {

                const return_object = {
                    conversationId: dataConversation.conversationId,
                    identifier: dataConversation.identifier,
                    firstContact: dataConversation.dateMessage,
                    name: dataConversation.name,
                    operatorId: dataConversation.operatorId,
                    status: dataConversation.status,
                    dateCreated: dataConversation.dateCreated,
                    messages: dadosMensagens
                };

                res.status(200).json(return_object);
            } else {
                res.status(404).send({
                    status: "error",
                    mensagem: "Messages not found"
                });
            }
        } else {
            res.status(404).send({
                status: "error",
                mensagem: "conversationId not found"
            });
        }
    } catch (error) {
        console.error("Ocorreu um erro no getMessages: ", error)
        res.json(error);
    }
}


// setInterval(() => {
//     dispararProtocolos()
// }, 5000);


export async function obterDadosProtocolos(req: any, res: any) {
    const db = await getClient();
    const collectionProtocolos = db.collection('PROTOCOLOS');
    let search: any = {}
    if (req.query.operatorId !== undefined && req.query.operatorId !== null) {
        search.operatorId = parseInt(req.query.operatorId);
    }
    if (req.query.status !== undefined && req.query.status !== null) {
        search.status = (req.query.status).toString();
    } else {
        search.status = "A";
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

    return res.json(resultados).status(200);
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


function getDataConversation(conversationId: string): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            let search: any = {
                _id: new BSON.ObjectId(conversationId)
            };

            const data = await collection.findOne(search);

            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}