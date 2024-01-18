import express, {
    Request,
    Response
} from 'express';
import bodyParser from 'body-parser';


const meuEmitter = require('../../../Events/Emitter');


const utils = require('../utils/utils');

let token = process.env.TOKEN_META;

const router = express.Router();

let options : any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
};

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));

router.get('/webhook', (req: Request, res: Response) => {
    const query: any = req.query;

    res.status(200).send(query["hub.challenge"]);
});

router.post('/webhook', async (req: Request, res: Response) => {
    const body: any = req.body;


    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const entry = body.entry[0].changes[0].value.messages[0];
        if (entry) {
            let numero = entry.from;
            let name = body.entry[0].changes[0].value.contacts[0].profile.name;
            const dataHora = new Date(entry.timestamp * 1000);


            let dados = {
                type: entry.type,
                identifier: numero,
                message: await utils.getType(entry),
                name: name,
                provider: "whats_meta",
            };


            if (dados) {
                meuEmitter.emit('message', dados);
            }
        }
    }

    res.sendStatus(200);
});

// router.get('/webhookInsta', (req: Request, res: Response) => {
//     const query: any = req.query;

//     res.status(200).send(query["hub.challenge"]);
// });

// router.post('/webhookInsta', (req: Request, res: Response) => {
//     const body: any = req.body;
//     console.log(body)
//     // if (body.entry[0].changes[0].value.messages) {
//     //     const entry = body.entry[0].changes[0].value.messages[0];
//     //     if (entry) {
//     //         let numero = entry.from;
//     //         let name = body.entry[0].changes[0].value.contacts[0].profile.name
//     //         let dados = null;

//     //         if (entry.text) {
//     //             let entryText = entry.text.body;
//     //             dados = {
//     //                 event: "text",
//     //                 from: numero,
//     //                 message: entryText,
//     //                 name: name,
//     //                 system: "whats_meta"
//     //             };
//     //         } // else if (entry.interactive && entry.interactive.button_reply && entry.interactive.button_reply.id) {
//     //         //     let entryId = entry.interactive.button_reply.id;
//     //         //     dados = {;
//     //         //         event: "button_reply",
//     //         //         from: numero,
//     //         //         body: entryId
//     //         //     };
//     //         // } else if (entry.button && entry.button.text) {
//     //         //     let buttonText = entry.button.text;
//     //         //     dados = {
//     //         //         event: "button",
//     //         //         from: numero,
//     //         //         body: buttonText
//     //         //     };
//     //         // } else {}

//     //         if (dados) {
//     //             meuEmitter.emit('message', dados);
//     //         }
//     //     }
//     // }

//     res.sendStatus(200);
// });


export default router;