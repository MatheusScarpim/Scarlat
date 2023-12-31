const axios = require('axios');
let token = "Bearer EAAJNmZCG2iSsBO5x4blLPZACDYJZBmTPrwqJnbT4XybZAKnFr4gN54PDcoF9ZC5VK3JebTvagIyRP14Fqio3NrUI2Og1Ttl0nwzMuwf08rYr02TNgrad33ol1CB0oGaAbzimesYr5g5e20YEwxA6I81xJZBzHbPKb1tfs0D6uwSZCEHfKwISdqwkzSAtjTkVwVLQopDSV3xwHlbPrtNjvpu"
const url = 'https://graph.facebook.com/v17.0/138522866009140/messages';
const urlMedia = 'https://graph.facebook.com/v17.0/138522866009140/media';
const storagesADO = require('../../../src/Solicitacao_de_emprestimo/storage');
const stagesADO = require('../../../src/Solicitacao_de_emprestimo/stages');


function sendText(from, message) {
    console.log(`-------------------------------------------------------------------`);
    console.log(`-----------------REALIZANDO DISPARO DE TEXTO-----------------------`);
    console.log(`-------------------------------------------------------------------`);
    const data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": from,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": message
        }
    };
    console.log(`\nEnviando Mensagem: ${message} \n
                Para: ${from}\n`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    axios.post(url, data, {
        headers
    })
        .then(response => {
            console.log('Resposta da API:', response.data);
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    console.log(`-------------------------------------------------------------------`);
    console.log(`-----------------FINALIZANDO DISPARO DE TEXTO-----------------------`);
    console.log(`-------------------------------------------------------------------`);
}

function sendButton(from, textoBotao, botoes) {

    const data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": from,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": textoBotao
            },
            "action": {
                "buttons": botoes
            }
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    axios.post(url, data, {
        headers
    })
        .then(response => {
            console.log('Resposta da API:', response.data);
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}

async function sendTemplate(from, template, body) {
    let variaveis = body.components;
    console.log(`-------------------------------------------------------------------`);
    console.log(`-----------------REALIZANDO DISPARO TEMPLATE-----------------------`);
    console.log(`-------------------------------------------------------------------`);
    let data;
    if (variaveis.lenght <= 0) {
        data = {
            "messaging_product": "whatsapp",
            "to": from,
            "type": "template",
            "template": {
                "name": template,
                "language": {
                    "code": "pt_BR"
                },
            }
        };
    } else {
        data = {
            "messaging_product": "whatsapp",
            "to": from,
            "type": "template",
            "template": {
                "name": template,
                "language": {
                    "code": "pt_BR"
                },
                "components": [{
                    "type": "body",
                    "parameters": variaveis
                }]
            }
        };
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    return axios.post(url, data, {
        headers
    })
        .then(response => {
            console.log('Resposta da API:', response.data)
            const currentStage = stagesADO.getStage({
                from: from
            });

            storagesADO.storage[from].nome = variaveis[0].text;
            storagesADO.storage[from].processo = variaveis[1].text;
            console.log(`\nNome Template: ${template}\n`);
            console.log(`Nome do Cooperado: ${variaveis[0].text} | Aberto Processo: ${variaveis[1].text} | De numero: ${from} Com SUCESSO\n`);
            console.log(`-------------------------------------------------------------------`);
            console.log(`-----------------FINALIZADO DISPARO TEMPLATE-----------------------`);
            console.log(`-------------------------------------------------------------------`);
            return response; // Retorne a resposta bem-sucedida
        })
        .catch(error => {
            console.error('Erro na requisição:', error);

            // Você pode personalizar a resposta de erro aqui
            console.log(`-------------------------------------------------------------------`);
            console.log(`-----------------FINALIZADO DISPARO TEMPLATE-----------------------`);
            console.log(`-------------------------------------------------------------------`);
            return {
                status: 'error',
                message: 'Ocorreu um erro na requisição.',
                details: error
            };
        });

}

async function uploadFile(nomeDocumento, body, mimeType, res) {
    try {
        const form = new FormData();
        form.append('messaging_product', 'whatsapp');

        // console.log(body.base64);
        // Suponhamos que body.base64 contenha a imagem em Base64
        const base64Image = body.base64;

        // Converta a imagem em Base64 de volta para um Blob
        const imageBlob = blobUtil.base64StringToBlob(base64Image, mimeType);

        // Adicione a imagem como um Blob ao FormData
        form.append('image_data', imageBlob, nomeDocumento);

        // Defina o tipo de conteúdo diretamente no FormData
        form.append('type', mimeType);

        // Defina os cabeçalhos diretamente no objeto `form`
        form.headers = {
            ...form.headers,
            'Authorization': token,
        };
        console.log(form);

        axios
            .post(urlMedia, form, {
                headers: form.headers,
            })
            .then((response) => {
                console.log('Resposta da API:', response.data);
                // Retorne a resposta da API, se necessário
                return response.data;
            })
            .catch((error) => {
                console.error('Erro ao fazer a requisição:', error);
                // Retorne o erro, se necessário
                return "Erro ao fazer a requisição: " + error;
            });
    } catch (error) {
        console.log(error);
        return "ERROR: " + error;
    }
}

async function sendFile(from, idDoc, nomDoc) {
    console.log(`-------------------------------------------------------------------`);
    console.log(`-----------------REALIZANDO DISPARO DE DOCUMENTO-------------------`);
    console.log(`-------------------------------------------------------------------`);
    const body = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": from,
        "type": "document",
        "document": {
            "id": idDoc,
            "filename": nomDoc
        }
    };
    console.log(`\nDocumento de ID: ${idDoc} sendo enviado para ${from} com o nome de ${nomDoc}\n`);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };
    console.log(`-------------------------------------------------------------------`);
    console.log(`-----------------FINALIZADO DISPARO DE DOCUMENTO-------------------`);
    console.log(`-------------------------------------------------------------------`);
    return axios.post(url, body, {
        headers
    });
}

async function getMessageReply(from, idDoc, nomDoc) {

    const body = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": from,
        "type": "document",
        "document": {
            "id": idDoc,
            "filename": nomDoc
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };
    console.log(body);
    return axios.post(url, body, {
        headers
    });
}

module.exports.sendText = sendText;
module.exports.sendButton = sendButton;
module.exports.sendTemplate = sendTemplate;
module.exports.uploadFile = uploadFile;
module.exports.sendFile = sendFile;