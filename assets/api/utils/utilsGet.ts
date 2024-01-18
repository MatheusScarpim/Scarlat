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


            const data = await collection.findOne({
                _id: new BSON.ObjectId(conversationId)
            });

            resolve(data);
        } catch (error) {
            console.error(error)
            reject(error);
        }
    });
}