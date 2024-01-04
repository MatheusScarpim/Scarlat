import express, {
    Router,
    Request,
    Response
} from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import cli from 'nodemon/lib/cli';
const client = require("../../modules/Client/client")



let cachedClient: any = null;
let cachedDb: any = null;
let entradaCount: number = 0;
const MAX_ENTRADAS: number = 10;
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});


const router: Router = express.Router();

router.use(bodyParser.json({
    limit: '50mb'
}));


router.patch('/readMessage', updateNotReads);
router.post('/sendMessage', client.sendAPI);

 async function updateNotReads(req : Request, res : Response) {
    let conversationId = req.body.conversationId;
    try {
        const db = await obterCliente();
        const collection = db.collection('MENSAGENS');
        await collection.updateMany({
            conversationId: conversationId,
            read: "false"
        }, {
            $set: {
                read: "true"
            }
        });
        res.status(200).json({
            "status": "sucess"
        })
    } catch (error) {
        console.error("error updateNotReads",error);
        res.status(400).json({
            "status": "error"
        })
    }
}



// router.post('/sendTemplate', )




// router.post('/sendOptions', enviarOpcoes);
// router.post('/sendFileBase64', sendFileBase64);




// async function verificarToken(token) {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, 'supersecret', (err, decoded) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(decoded);
//             }
//         });
//     });
// }





// async function sendMessage(req, res) {
//     try {
//         const {
//             telnumber,
//             token,
//             protocolo
//         } = req.headers;
//         const {
//             message
//         } = req.body;
//         let decoded;
//         if (token.toString() == "sC@rl1T") {
//             decoded = true;
//         } else {
//             decoded = await verificarToken(token);
//         }
//         if (decoded) {
//             const numeroExiste = telnumber + '@c.us';


//             const currentStage = stagesADO.getStage({
//                 from: numeroExiste
//             });
//             if (protocolo == "true") {
//                 if (storagesADO.storage[numeroExiste].protocolo != 0) {
//                     geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
//                 }
//                 await clientInstance.client.sendText(numeroExiste, message.toString());
//                 let numProcotocolo;
//                 setTimeout(() => {
//                     geraProtocolo.CriarProtocoloPrincipal(telnumber)
//                         .then((nextId) => {
//                             storagesADO.storage[numeroExiste].protocolo = nextId;
//                             storagesADO.storage[numeroExiste].stage = 0;

//                             numProcotocolo = nextId;

//                             setTimeout(() => {
//                                 geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
//                             }, 1000);
//                             res.json({
//                                 "status": "sucess",
//                                 "protocolo": numProcotocolo
//                             });
//                         })
//                         .catch((error) => {
//                             console.error("Erro ao criar protocolo:", error);
//                         });
//                 }, 1000);
//             } else if (protocolo == "false") {
//                 if (storagesADO.storage[numeroExiste].stage == 0) {
//                     await clientInstance.client.sendText(numeroExiste, message.toString());
//                     if (storagesADO.storage[numeroExiste].protocolo != 0 && storagesADO.storage[numeroExiste].protocolo) {
//                         setTimeout(() => {
//                             geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
//                         }, 1000);
//                     }
//                 } else {
//                     res.status(404).json({
//                         "status": "ERRO",
//                         "retorno": "Não é possivel enviar com um protocolo de opções aberto"
//                     })
//                 }
//                 res.json({
//                     "status": "sucess"
//                 });
//             } else {
//                 res.json({
//                     "status": "Só é aceito TRUE ou FALSE em protocolo"
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
//         res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
//     }
// }

// async function sendFileBase64(req, res) {
//     try {
//         const {
//             telnumber,
//             token,
//             nomearquivo
//         } = req.headers;
//         const {
//             base64
//         } = req.body;
//         let decoded;

//         if (token.toString() == "sC@rl1T") {
//             decoded = true;
//         } else {
//             decoded = await verificarToken(token);
//         }

//         if (decoded) {
//             console.log("Base64");
//             console.log(base64);
//             console.log(telnumber);
//             let retorno = await clientInstance.client.sendFile(telnumber + "@c.us", base64, nomearquivo);

//             console.log(retorno);
//             res.json(retorno);
//         } else {
//             res.status(401).send({
//                 status: "erro",
//                 mensagem: "Token inválido"
//             });
//         }
//     } catch (error) {
//         res.send(error);
//     }
// }

// async function enviarOpcoes(req, res) {
//     try {
//         const {
//             telnumber,
//             token,
//         } = req.headers;
//         const {
//             params
//         } = req.body
//         // params : {
//         //   message: "";
//         //   opcoes: [{
//         //     type: "CALLBACK,CANCELAR,FINALIZAR,TEXTO",
//         //     id : ""
//         //     method : ""
//         //     text: "",
//         //     callback: "",
//         //     reply: ""
//         //   }]
//         // }

//         let montaMensagem = `${params.message}\n${params.opcoes.map((opcao) => `${opcao.id} - ${opcao.text}`).join("\n")}`;
//         let decoded;
//         if (token.toString() == "sC@rl1T") {
//             decoded = true;
//         } else {
//             decoded = await verificarToken(token);
//         }
//         if (decoded) {
//             const numeroExiste = telnumber + '@c.us';


//             const currentStage = stagesADO.getStage({
//                 from: numeroExiste
//             });

//             if (storagesADO.storage[numeroExiste].protocolo != 0) {
//                 geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
//             }

//             await clientInstance.client.sendText(numeroExiste, montaMensagem);

//             let numProcotocolo;

//             setTimeout(() => {
//                 geraProtocolo.CriarProtocoloPrincipal(telnumber)
//                     .then((nextId) => {
//                         storagesADO.storage[numeroExiste].protocolo = nextId;
//                         storagesADO.storage[numeroExiste].params = params;

//                         numProcotocolo = nextId;

//                         setTimeout(() => {
//                             geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, montaMensagem);
//                         }, 1000);
//                         res.json({
//                             "status": "sucess",
//                             "protocolo": numProcotocolo
//                         });
//                     })
//                     .catch((error) => {
//                         console.error("Erro ao criar protocolo:", error);
//                     });
//             }, 1000);
//         }
//     } catch (error) {
//         console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
//         res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
//     }
// }


function formatarNumero(numero: string) {
    // Remova o prefixo '55' e aplique a máscara de formatação desejada
    const numeroSemPrefixo = numero.replace(/^55/, '').replace("@c.us", "");

    // Formatação do número para o estilo (XX) XXXXX-XXXX
    const ddd = numeroSemPrefixo.substring(0, 2);
    const primeiraParte = numeroSemPrefixo.substring(2, 7);
    const segundaParte = numeroSemPrefixo.substring(7);

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}

async function obterCliente() {
    if (!cachedClient || !cachedDb) {
        cachedClient = await obterCliente();
        cachedDb = cachedClient.db('ScarlatDataBase');
    }
    return cachedDb;
}

// async function obterDadosProtocolos(status) {
//     let retorno = [];
//     const client = await obterCliente();
//     const db = client.db('ScarlatDataBase');
//     const collectionProtocolos = db.collection('PROTOCOLOS');

//     const dataProtocolos = await collectionProtocolos.find({
//         STATUS: status.toString(),
//     }).toArray();
//     const collectionMensagem = db.collection('MENSAGENS');

//     // Usando Promise.all para esperar por todas as consultas assíncronas
//     await Promise.all(dataProtocolos.map(async (elemento) => {
//         try {
//             // Obter a última mensagem para o protocolo, independentemente de ter sido lida ou não
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
//                     FOTOPERFIL: elemento["FOTOPERFIL"],
//                     NUMERO: formatarNumero(elemento["NUMERO"]),
//                     NAO_LIDAS: await collectionMensagem.countDocuments({
//                         PROTOCOLO_ID: parseInt(elemento["_id"]),
//                         LIDA: "false"
//                     }),
//                     DATA_CRIACAO: elemento["DATA_CRIACAO"],
//                     ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
//                     ULTIMA_MENSAGEM: ultimaMensagem.MENSAGEM
//                 });
//             } else {
//                 // Nenhuma mensagem encontrada para o protocolo
//                 retorno.push({
//                     PROTOCOLO_ID: elemento["_id"],
//                     NOME: elemento["NOME"],
//                     FOTOPERFIL: elemento["FOTOPERFIL"],
//                     NUMERO: formatarNumero(elemento["NUMERO"]),
//                     DATA_CRIACAO: elemento["DATA_CRIACAO"],
//                     ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
//                     ULTIMA_MENSAGEM: "Nenhuma mensagem encontrada"
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
//         }
//     }));
//     retorno.sort((a, b) => b.NAO_LIDAS - a.NAO_LIDAS);
//     return retorno;
// }

export default router;
