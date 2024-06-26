import express, {
    Request,
    Response,
    Router
} from 'express';
import bodyParser from 'body-parser';
const meuEmitter = require("../../../modules/Events/Emitter")

import {
    getMessagesId,
    obterDadosProtocolos
} from '../utils/utilsGet';

const router = express.Router();

router.use(bodyParser.json({
    limit: '50mb'
}));

router.post('/webhookteste', retornaWebhook);

router.post('/protocolos', retornaWebhookProtocolos);

router.get('/getMessages', getMessagesId);

router.get('/getConversations', obterDadosProtocolos);


function retornaWebhook(req: Request, res: Response): void {
    // For example: res.status(200).json({ message: 'Webhook received successfully' });
}

function retornaWebhookProtocolos(req: Request, res: Response): void {
    meuEmitter.meuEmitter.emit("protocolos", req.body);
}



export default router;