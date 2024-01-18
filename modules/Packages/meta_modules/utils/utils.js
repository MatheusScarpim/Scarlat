let token = process.env.TOKEN_META;

const utilsAll = require("../../utils/utilsAll")

async function getType(entry) {
    let type = entry.type
    if (type == "text") {
        type = "chat";
        return entry.text.body
    } else if (type == "audio") {
        type == "ptt"
        return {
            fileBase: await getArchive(entry.audio.id)
        }
    } else if (type == "image") {
        type == "image"
        let archive = await getArchive(entry.image.id)
        return {
            fileBase: await utilsAll.decreaseImageQuality(archive, 60)
        }
    } else if (type == "document") {
        type == "document"
        return {
            fileBase: await getArchive(entry.document.id),
            fileName: entry.document.filename
        }
    }
}

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function getIdMedia(base64, fileName, type) {
    try {
        const url = process.env.URL_META_MEDIA;
        let buffer;
        if (type == "image") {
            buffer = Buffer.from(await utilsAll.decreaseImageQuality(base64, 60), 'base64');
        } else {
            buffer = Buffer.from(base64, 'base64');
        }
        const tempFilePath = `${__dirname}/${fileName}`;
        fs.writeFileSync(tempFilePath, buffer);

        const formData = new FormData();
        formData.append('messaging_product', 'whatsapp');
        formData.append('file', fs.createReadStream(tempFilePath), fileName);

        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': token,
            },
        });


        return response.data.id;
    } catch (error) {
        console.error('Erro ao enviar imagem para o Facebook:', error);
    } finally {
        const tempFilePath = `${__dirname}/${fileName}`;
        await fs.unlinkSync(tempFilePath);
    }
}

async function getArchive(media) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    try {
        const response = await axios({
            url: 'https://graph.facebook.com/v17.0/' + media,
            method: 'GET',
            headers,
        });

        return await getBase64(response.data.url)
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getBase64(link) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    try {
        const response = await axios({
            url: link,
            method: 'GET',
            headers,
            responseType: 'arraybuffer',
        });

        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return base64;
    } catch (error) {
        console.error(error);
        return null;
    }
}
module.exports.getIdMedia = getIdMedia
module.exports.getType = getType