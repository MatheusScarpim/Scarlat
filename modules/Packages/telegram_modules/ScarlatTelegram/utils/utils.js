const utilsAll = require("../../../utils/utilsAll")


async function getType(client, message) {
    return new Promise(async (resolve, reject) => {
        try {
            if ("text" in message) {
                resolve({
                    type: "chat",
                    message: message.text
                });
            } else if ("document" in message) {
                let link = await client.getFileLink(message.document.file_id);
                let linkFormat = JSON.parse(JSON.stringify(link).replace("URL ", ""));
                let base = await getArchive(linkFormat);
                resolve({
                    type: "document",
                    message: {
                        fileName: message.document.file_name,
                        fileBase: base,
                    }
                });
            } else if ("photo" in message) {
                let link = await client.getFileLink(message.photo[3].file_id);
                let linkFormat = JSON.parse(JSON.stringify(link).replace("URL ", ""));
                let base = await getArchive(linkFormat);
                const resizedBase64Data = await utilsAll.decreaseImageQuality(base, 60);
                resolve({
                    type: "image",
                    message: {
                        fileBase: resizedBase64Data
                    }
                });
            } else if ("voice" in message) {
                let link = await client.getFileLink(message.voice.file_id);
                let linkFormat = JSON.parse(JSON.stringify(link).replace("URL ", ""));
                let base = await getArchive(linkFormat);
                resolve({
                    type: "ptt",
                    message: {
                        fileBase: base,
                    }
                });
            } else {
                reject(new Error("Unsupported message type"));
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

const axios = require('axios');
const fs = require('fs');

function getArchive(urlImagem) {
    return new Promise((resolve, reject) => {
        axios.get(urlImagem, {
                responseType: 'arraybuffer'
            })
            .then(response => {
                resolve(Buffer.from(response.data, 'binary').toString('base64'));
            })
            .catch(error => {
                console.error('Erro ao obter a imagem:', error);
                reject(error);
            });
    });

}

async function getBuffer(base64, fileName, type) {
    try {
        const buffer = Buffer.from(base64, 'base64');
        const tempFilePath = `${__dirname}/${fileName}`;
        await fs.writeFile(tempFilePath, buffer);
        return fs.createReadStream(tempFilePath);
    } catch (error) {
        console.error("Error getBuffer: ", error)
    } finally {
        const tempFilePath = `${__dirname}/${fileName}`;
        await fs.unlinkSync(tempFilePath);
    }
}
module.exports.getBuffer = getBuffer
module.exports.getArchive = getArchive;
module.exports.getType = getType;