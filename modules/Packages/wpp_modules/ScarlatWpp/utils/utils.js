const utilsAll = require("../../../utils/utilsAll")


async function getType(client, message) {
    let type = message.type;
    if (type == "chat") {
        return message.body;
    } else if (type == "document") {
        let base = await client.downloadMedia(message.id)
        let baseFormat = base.split("base64,")
        console.log(baseFormat[0].replace("data:", "").replace(";", ""))
        return {
            fileName: message.fileName,
            fileBase: baseFormat[1],
            mimeType: baseFormat[0].replace("data:", "").replace(";", "")
        }
    } else if (type == "image") {
        let base = await client.downloadMedia(message.id);
        try {
            const resizedBase64Data = await utilsAll.decreaseImageQuality(base, 60);
            return {
                fileBase: resizedBase64Data,
            };
        } catch (error) {
            console.error(error);
        }
    } else if (type == "ptt") {
        let base = await client.downloadMedia(message.id)
        let baseFormat = base.split("base64,")[1]
        return {
            fileBase: baseFormat,
        }
    }
}


async function getBase64Image(client, from) {
    return new Promise(async (resolve, reject) => {
        const Foto = await client.getProfilePicFromServer(from);
        if (Foto.tag != null) {
            resolve(await imageUrlToBase64(Foto.imgFull))
        } else {
            resolve(null);
        }
    })
}

const axios = require("axios")
async function imageUrlToBase64(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data, 'binary');
        const base64String = buffer.toString('base64');
        return base64String;
    } catch (error) {
        throw new Error('Erro ao converter imagem para base64: ' + error.message);
    }
}
module.exports.getType = getType;
module.exports.getBase64Image = getBase64Image