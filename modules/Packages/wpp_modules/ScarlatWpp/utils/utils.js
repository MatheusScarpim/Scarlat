const utilsAll = require("../../../utils/utilsAll")


async function getType(client, message) {
    let type = message.type;
    if (type == "chat") {
        return message.body;
    } else if (type == "document") {
        let base = await client.downloadMedia(message.id)
        let baseFormat = base.split("base64,")[1]
        return {
            fileName: message.fileName,
            fileBase: baseFormat,
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

module.exports.getType = getType;