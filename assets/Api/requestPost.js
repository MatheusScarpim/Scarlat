const express = require('express');
const stagesADO = require('../bot/stages.js');
const jwt = require('jsonwebtoken');
// const clientInstance = require('../../../server.js');
const bodyParser = require('body-parser');
const multer = require('multer');
// const geraProtocoloMSG = require('../DB/gerarProtocolos/geraDadosProtocolo.js')
// const geraProtocolo = require('../DB/gerarProtocolos/geraProtocoloPrincipal.js');
// const storagesADO = require('../bot/storage.js');
// Aumente o limite de tamanho para 20 MB (ou ajuste conforme necessário)
let cachedClient = null;
let cachedDb = null;
let entradaCount = 0;
const MAX_ENTRADAS = 10; // Defina o número máximo de entradas antes de fechar e reabrir a conexão
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB em bytes (ajuste conforme necessário)
    },
});


const router = express.Router();

router.use(bodyParser.json({
    limit: '50mb'
}));


// router.post('/sendMessage', enviarMensagemTextoNaoOficial);
// router.post('/lerMensagem', ProtocoloLido);
// router.post('/sendOptions', enviarOpcoes);
// router.post('/sendFileBase64', sendFileBase64);



async function verificarToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'supersecret', (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

async function enviarMensagemTextoNaoOficial(req, res) {
    try {
        const {
            telnumber,
            token,
            protocolo
        } = req.headers;
        const {
            message
        } = req.body;
        let decoded;
        if (token.toString() == "sC@rl1T") {
            decoded = true;
        } else {
            decoded = await verificarToken(token);
        }
        if (decoded) {
            const numeroExiste = telnumber + '@c.us';


            const currentStage = stagesADO.getStage({
                from: numeroExiste
            });
            if (protocolo == "true") {
                if (storagesADO.storage[numeroExiste].protocolo != 0) {
                    geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
                }
                await clientInstance.client.sendText(numeroExiste, message.toString());
                let numProcotocolo;
                setTimeout(() => {
                    geraProtocolo.CriarProtocoloPrincipal(telnumber)
                        .then((nextId) => {
                            storagesADO.storage[numeroExiste].protocolo = nextId;
                            storagesADO.storage[numeroExiste].stage = 0;

                            numProcotocolo = nextId;

                            setTimeout(() => {
                                geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
                            }, 1000);
                            res.json({
                                "status": "sucesso",
                                "protocolo": numProcotocolo
                            });
                        })
                        .catch((error) => {
                            console.error("Erro ao criar protocolo:", error);
                        });
                }, 1000);
            } else if (protocolo == "false") {
                if (storagesADO.storage[numeroExiste].stage == 0) {
                    await clientInstance.client.sendText(numeroExiste, message.toString());
                    if (storagesADO.storage[numeroExiste].protocolo != 0 && storagesADO.storage[numeroExiste].protocolo) {
                        setTimeout(() => {
                            geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
                        }, 1000);
                    }
                } else {
                    res.status(404).json({
                        "status": "ERRO",
                        "retorno": "Não é possivel enviar com um protocolo de opções aberto"
                    })
                }
                res.json({
                    "status": "sucesso"
                });
            } else {
                res.json({
                    "status": "Só é aceito TRUE ou FALSE em protocolo"
                });
            }
        }
    } catch (error) {
        console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
        res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
    }
}

async function sendFileBase64(req, res) {
    try {
        const {
            telnumber,
            token,
            nomearquivo
        } = req.headers;
        const {
            base64
        } = req.body;
        let decoded;

        if (token.toString() == "sC@rl1T") {
            decoded = true;
        } else {
            decoded = await verificarToken(token);
        }

        if (decoded) {
            console.log("Base64");
            console.log(base64);
            console.log(telnumber);
            let retorno = await clientInstance.client.sendFile(telnumber + "@c.us", base64, nomearquivo);

            console.log(retorno);
            res.json(retorno);
        } else {
            res.status(401).send({
                status: "erro",
                mensagem: "Token inválido"
            });
        }
    } catch (error) {
        res.send(error);
    }
}

async function enviarOpcoes(req, res) {
    try {
        const {
            telnumber,
            token,
        } = req.headers;
        const {
            params
        } = req.body
        // params : {
        //   message: "";
        //   opcoes: [{
        //     type: "CALLBACK,CANCELAR,FINALIZAR,TEXTO",
        //     id : ""
        //     method : ""
        //     text: "",
        //     callback: "",
        //     reply: ""
        //   }]
        // }

        let montaMensagem = `${params.message}\n${params.opcoes.map((opcao) => `${opcao.id} - ${opcao.text}`).join("\n")}`;
        let decoded;
        if (token.toString() == "sC@rl1T") {
            decoded = true;
        } else {
            decoded = await verificarToken(token);
        }
        if (decoded) {
            const numeroExiste = telnumber + '@c.us';


            const currentStage = stagesADO.getStage({
                from: numeroExiste
            });

            if (storagesADO.storage[numeroExiste].protocolo != 0) {
                geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
            }

            await clientInstance.client.sendText(numeroExiste, montaMensagem);

            let numProcotocolo;

            setTimeout(() => {
                geraProtocolo.CriarProtocoloPrincipal(telnumber)
                    .then((nextId) => {
                        storagesADO.storage[numeroExiste].protocolo = nextId;
                        storagesADO.storage[numeroExiste].params = params;

                        numProcotocolo = nextId;

                        setTimeout(() => {
                            geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, montaMensagem);
                        }, 1000);
                        res.json({
                            "status": "sucesso",
                            "protocolo": numProcotocolo
                        });
                    })
                    .catch((error) => {
                        console.error("Erro ao criar protocolo:", error);
                    });
            }, 1000);
        }
    } catch (error) {
        console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
        res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
    }
}

async function ProtocoloLido(req, res) {
    try {
        const {
            protocolo,
            token
        } = req.headers;
        let decoded;

        if (token.toString() == "sC@rl1T") {
            decoded = true;
        } else {
            decoded = await verificarToken(token);
        }

        if (decoded) {

            let retorno = await alterarNaoLidos(protocolo)

            res.json(retorno);
        } else {
            res.status(401).send({
                status: "erro",
                mensagem: "Token inválido"
            });
        }
    } catch (error) {
        res.send(error);
    }
}

function formatarNumero(numero) {
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

async function obterDadosProtocolos(status) {
    let retorno = [];
    const client = await obterCliente();
    const db = client.db('ScarlatDataBase');
    const collectionProtocolos = db.collection('PROTOCOLOS');

    const dataProtocolos = await collectionProtocolos.find({
        STATUS: status.toString(),
    }).toArray();
    const collectionMensagem = db.collection('MENSAGENS');

    // Usando Promise.all para esperar por todas as consultas assíncronas
    await Promise.all(dataProtocolos.map(async (elemento) => {
        try {
            // Obter a última mensagem para o protocolo, independentemente de ter sido lida ou não
            let ultimaMensagem = await collectionMensagem.find({
                PROTOCOLO_ID: parseInt(elemento["_id"]),
            }).sort({
                DATA_ENVIO: -1
            }).limit(1).toArray();

            if (ultimaMensagem.length > 0) {
                ultimaMensagem = ultimaMensagem[0];

                retorno.push({
                    PROTOCOLO_ID: elemento["_id"],
                    NOME: elemento["NOME"],
                    FOTOPERFIL: elemento["FOTOPERFIL"],
                    NUMERO: formatarNumero(elemento["NUMERO"]),
                    NAO_LIDAS: await collectionMensagem.countDocuments({
                        PROTOCOLO_ID: parseInt(elemento["_id"]),
                        LIDA: "false"
                    }),
                    DATA_CRIACAO: elemento["DATA_CRIACAO"],
                    ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
                    ULTIMA_MENSAGEM: ultimaMensagem.MENSAGEM
                });
            } else {
                // Nenhuma mensagem encontrada para o protocolo
                retorno.push({
                    PROTOCOLO_ID: elemento["_id"],
                    NOME: elemento["NOME"],
                    FOTOPERFIL: elemento["FOTOPERFIL"],
                    NUMERO: formatarNumero(elemento["NUMERO"]),
                    DATA_CRIACAO: elemento["DATA_CRIACAO"],
                    ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
                    ULTIMA_MENSAGEM: "Nenhuma mensagem encontrada"
                });
            }
        } catch (error) {
            console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
        }
    }));
    retorno.sort((a, b) => b.NAO_LIDAS - a.NAO_LIDAS);
    return retorno;
}



//    let dadosNaoLidos = await PegarNaoLidos(protocolo);


async function alterarNaoLidos(protocolo) {
    try {
        const client = await obterCliente();
        const db = client.db('ScarlatDataBase');
        const collection = db.collection('MENSAGENS');
        await collection.updateMany({
            PROTOCOLO_ID: parseInt(protocolo),
            LIDA: "false"
        }, {
            $set: {
                LIDA: "true"
            }
        });
        return {
            "status": "sucesso"
        }
    } catch (error) {
        console.log(error);
    }
    return {
        "status": "ERRO"
    }
}

module.exports = router;