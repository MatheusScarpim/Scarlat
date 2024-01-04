const ScarlatMetaWhats = require("../packages/meta_modules/ScarlatMetaWhats/Requisicoes/API")
const ScarlatWhatsWpp = require("../packages/wpp_modules/ScarlatWpp/Sistema/sistema")
const ScarlatTelegram = require("../packages/wpp_modules/ScarlatTelegram/Sistema/sistema");
const client = require("../wpp_modules/ScarlatWpp/Sistema/sistema");

function sendAPI(req) {
    let type = req.body.type
    if (type == "text") {
        return sendTextClient(req)
    }
}

function getClient(provider) {
    if (provider == "whats_wpp") {
        return ScarlatWhatsWpp;
    } else if (provider == "whats_meta") {
        return ScarlatMetaWhats;
    } else if (provider == "telegram") {
        return ScarlatTelegram.telegram;
    } else {
        return;
    }
}


function sendTextClient(req) {
    const {
        conversationId,
        operatorId,
        identifier,
        provider,
        message,
    } = req.headers;
    let client = getClient(provider);
    try {
        if (provider == "whats_wpp") {
            let identifierUs = identifier + "@c.us"
            client.sendText(identifierUs, message)
            return
        } else {
            client.sendMessage(identifier, message)
        }
        return JSON.stringify({
            "status": "sucess"
        })
    } catch (error) {
        console.log("Error sendTextClient: " + e)
        return JSON.stringify({
            "status": "error"
        })
    }
}

export default sendAPI