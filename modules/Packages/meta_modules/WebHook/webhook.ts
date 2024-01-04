import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const meuEmitter = require('../../../Events/Emitter');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));

router.get('/webhook', (req: Request, res: Response) => {
    const query: any = req.query;

    res.status(200).send(query["hub.challenge"]);
});

router.post('/webhook', (req: Request, res: Response) => {
    const body: any = req.body;

    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const entry = body.entry[0].changes[0].value.messages[0];

        if (entry) {
            let numero = entry.from;
            let name = body.entry[0].changes[0].value.contacts[0].profile.name;
            let dados : {event : string, from : string, message : string, name : string , provider: string} | null = null;

            if (entry.text) {
                let entryText = entry.text.body;
                dados = {
                    event: "text",
                    from: numero,
                    message: entryText,
                    name: name,
                    provider: "whats_meta"
                };
            }

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

