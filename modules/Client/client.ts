const ScarlatMetaWhats = require("../Packages/meta_modules/ScarlatMetaWhats/Requisicoes/API");
const ScarlatWhatsWpp = require("../Packages/wpp_modules/ScarlatWpp/Sistema/sistema")
// const ScarlatTelegrama = require("../Packages/telegram_modules/ScarlatTelegram/Sistema/sistema")
const utilsAll = require("../Packages/utils/utilsAll")


function getClient(provider: string) {
    if (provider == "whats_wpp") {
        return ScarlatWhatsWpp.client;
    } else if (provider == "whats_meta") {
        return ScarlatMetaWhats.client;
    } else if (provider == "telegram") {
        // return ScarlatTelegrama.bot.telegram;
    } else {
        return;
    }
}


async function sendTextClient(params: any) {
    const {
        conversationId,
        operatorId,
        identifier,
        provider,
        message,
    } = params.body;
    let client = getClient(provider);
    try {
        if (provider == "whats_wpp") {
            let identifierUs = identifier + "@c.us"
            client.sendText(identifierUs, message)
        } else if (provider == "whats_meta" || provider == "telegram") {
            client.sendMessage(identifier, message)
        } else {
            throw Error()
        }

        return {
            "status": "success",
        }
    } catch (error) {
        console.error("Error sendTextClient: ", error)
        return {
            "status": "error"
        }
    }
}

async function sendTemplateClient(params: any) {
    const {
        conversationId,
        operatorId,
        identifier,
        provider,
        message,
        components
    } = params.body;
    let client = getClient(provider)
    try {
        if (provider == "whats_meta") {
            client.sendTemplate(identifier, message, components)

            return {
                "status": "success"
            }
        } else {
            return {
                "status": "error",
                "message": `This action is not possible with ${provider}`
            }
        }
    } catch (error) {
        console.error("Error sendTextClient: ", error)
        return {
            "status": "error"
        }
    }
}

async function sendFileBase64Client(params: any) {
    try {
        const {
            conversationId,
            operatorId,
            identifier,
            provider,
            message,
        } = params.body;
        let client = getClient(provider)
        let base64 = message.fileBase;

        if (message.type == "image") {
            base64 = await utilsAll.decreaseImageQuality(message.fileBase)
        }

        if (provider == "telegram") {
            // ScarlatTelegram.sendFile(identifier, base64, message.fileName, message.type)
        } else if (provider == "whats_wpp") {
            let identifierUs = identifier + "@c.us"
            client.sendFile(identifierUs, `data:${message.mimeType};base64,${base64}`, message.fileName);
        } else if (provider == "whats_meta") {
            client.sendFile(identifier, `${base64}`, message.fileName, message.type);
        } else {
            throw Error()
        }

        return {
            "status": "success"
        }

    } catch (error) {
        console.log(error)
        return {
            "status": "error"
        }
    }
}

module.exports.sendTextClient = sendTextClient
module.exports.sendTemplateClient = sendTemplateClient
module.exports.sendFileBase64Client = sendFileBase64Client