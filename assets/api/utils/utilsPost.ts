import express, {
    Request,
    Response
} from 'express';



import {
    getClient
} from "../../database/dataBase"

import {
    getExisting,
    addMessageUser,
    updateOperatorId,
    getProviderResp,
    getReadMessage,
    updateReading,
    updateStatusConversation,
    createConversation
} from '../../../modules/Conversations/generateConversations';


const Client = require("../../../modules/Client/client")


export async function updateNotReads(req: Request, res: Response) {
    let idMessage = req.body._id;
    try {
        if (await getReadMessage(idMessage)) {
            await updateReading(idMessage)
            res.status(200).json({
                "status": "success",
            })
        } else {
            res.status(400).json({
                "status": "error",
                "message": "Already read or not available"
            })
        }
    } catch (error) {
        console.error("error updateNotReads", error);
        res.status(400).json({
            "status": "error"
        })
    }
}

export async function createConversationId(req: Request, res: Response) {
    try {
        let retorno: any = await createConversation(req.body)
        if (retorno.status == "success") {
            res.status(200).json(retorno)
        } else {
            res.status(400).json(retorno)
        }
    } catch (error) {
        console.error("error createConversationId", error);
        res.status(400).json({
            "status": "error"
        })
    }
}


export async function updateConversation(req: Request, res: Response) {
    try {
        let retorno: any = await updateStatusConversation(req.body)
        if (retorno.status == "success") {
            res.status(200).json(retorno)
        } else {
            res.status(400).json(retorno)
        }
    } catch (error) {
        console.error("error updateNotReads", error);
        res.status(400).json({
            "status": "error"
        })
    }
}


export async function sendAPI(req: Request, res: Response) {
    try {
        let type = req.body.type

        let retorno;
        if (req.body.isConversation && !getExisting(req.body.conversationId)) {
            res.status(400).json({
                status: "error",
                message: "Not conversationId existing"
            })
        }


        if (!await getProviderResp(req.body)) {
            res.status(400).json({
                status: "error",
                message: "You are not responsible"
            })
        }

        if (type == "chat") {
            retorno = await Client.sendTextClient(req)
        } else if (type == "template") {
            retorno = await Client.sendTemplateClient(req)
        } else if (type == "base64") {
            retorno = await Client.sendFileBase64Client(req)
        }


        if (retorno.status == "error") {
            res.status(400).json(retorno)
        } else {
            if (req.body.isConversation) {
                await updateOperatorId(req.body.conversationId, req.body.operatorId)
                res.status(200).json(await addMessageUser(req.body, "B", true))
            } else {
                res.status(200).json(retorno)
            }
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
        })
    }
}