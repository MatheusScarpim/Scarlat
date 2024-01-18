const axios = require('axios');
let token = process.env.TOKEN_META;
const url = process.env.URL_META;
const utils = require("../../utils/utils")
// const storagesADO = require('../../../src/Solicitacao_de_emprestimo/storage');
// const stagesADO = require('../../../src/Solicitacao_de_emprestimo/stages');


function sendMessage(from, message) {
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

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    axios.post(url, data, {
            headers
        })
        .then((response) => {
            console.log('Resposta da API:', response.data);
        })
        .catch((error) => {
            console.error('Erro na requisição:', error);
        });
}

async function sendFile(identifier, base64, filename, type) {
    try {
        const idMedia = await utils.getIdMedia(base64, filename,type);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
        };

        let data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: identifier,
        };

        if (type == "image") {
            data.type = "image"
            data.image = {
                "id": idMedia
            }
        } else if (type == "document") {
            data.type = "document"
            data.document = {
                "id": idMedia
            }
        } else if (type == "ptt") {
            data.type = "audio"
            data.audio = {
                "id": idMedia
            }
        }

        const response = await axios({
            url: process.env.URL_META,
            method: 'POST',
            headers,
            data,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending file:", error);
    }
}

function sendTemplate(from, template, components) {
    let data;
    if (components.lenght <= 0) {
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
                    "parameters": components
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
            return response;
        })
        .catch(error => {
            console.error('Erro na requisição:', error);

            return {
                status: 'error',
                message: 'Ocorreu um erro na requisição.',
                details: error
            };
        });

}

let client = {
    sendMessage,
    sendTemplate,
    sendFile
}
module.exports.client = client;
// function sendButton(from, textoBotao, botoes) {

//     const data = {
//         "messaging_product": "whatsapp",
//         "recipient_type": "individual",
//         "to": from,
//         "type": "interactive",
//         "interactive": {
//             "type": "button",
//             "body": {
//                 "text": textoBotao
//             },
//             "action": {
//                 "buttons": botoes
//             }
//         }
//     }

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': token
//     };

//     axios.post(url, data, {
//             headers
//         })
//         .then(response => {
//             console.log('Resposta da API:', response.data);
//         })
//         .catch(error => {
//             console.error('Erro na requisição:', error);
//         });
// }


// // async function uploadFile(nomeDocumento, body, mimeType, res) {
// //     try {
// //         const form = new FormData();
// //         form.append('messaging_product', 'whatsapp');

// //         // console.log(body.base64);
// //         // Suponhamos que body.base64 contenha a imagem em Base64
// //         const base64Image = body.base64;

// //         // Converta a imagem em Base64 de volta para um Blob
// //         const imageBlob = blobUtil.base64StringToBlob(base64Image, mimeType);

// //         // Adicione a imagem como um Blob ao FormData
// //         form.append('image_data', imageBlob, nomeDocumento);

// //         // Defina o tipo de conteúdo diretamente no FormData
// //         form.append('type', mimeType);

// //         // Defina os cabeçalhos diretamente no objeto `form`
// //         form.headers = {
// //             ...form.headers,
// //             'Authorization': token,
// //         };
// //         console.log(form);

// //         axios
// //             .post(urlMedia, form, {
// //                 headers: form.headers,
// //             })
// //             .then((response) => {
// //                 console.log('Resposta da API:', response.data);
// //                 // Retorne a resposta da API, se necessário
// //                 return response.data;
// //             })
// //             .catch((error) => {
// //                 console.error('Erro ao fazer a requisição:', error);
// //                 // Retorne o erro, se necessário
// //                 return "Erro ao fazer a requisição: " + error;
// //             });
// //     } catch (error) {
// //         console.log(error);
// //         return "ERROR: " + error;
// //     }
// // }

// async function sendFile(from, idDoc, nomDoc) {
//     console.log(`-------------------------------------------------------------------`);
//     console.log(`-----------------REALIZANDO DISPARO DE DOCUMENTO-------------------`);
//     console.log(`-------------------------------------------------------------------`);
//     const body = {
//         "messaging_product": "whatsapp",
//         "recipient_type": "individual",
//         "to": from,
//         "type": "document",
//         "document": {
//             "id": idDoc,
//             "filename": nomDoc
//         }
//     };
//     console.log(`\nDocumento de ID: ${idDoc} sendo enviado para ${from} com o nome de ${nomDoc}\n`);
//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': token
//     };
//     console.log(`-------------------------------------------------------------------`);
//     console.log(`-----------------FINALIZADO DISPARO DE DOCUMENTO-------------------`);
//     console.log(`-------------------------------------------------------------------`);
//     return axios.post(url, body, {
//         headers
//     });
// }

// async function getMessageReply(from, idDoc, nomDoc) {

//     const body = {
//         "messaging_product": "whatsapp",
//         "recipient_type": "individual",
//         "to": from,
//         "type": "document",
//         "document": {
//             "id": idDoc,
//             "filename": nomDoc
//         }
//     };

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': token
//     };
//     console.log(body);
//     return axios.post(url, body, {
//         headers
//     });
// 
// module.exports.sendButton = sendButton;
// module.exports.sendTemplate = sendTemplate;
// // module.exports.uploadFile = uploadFile;
// module.exports.sendFile = sendFile;