const wpp = require('@wppconnect-team/wppconnect');
const meuEmitter = require("../../../../Events/Emitter");
const {
    getType
} = require('../utils/utils');

wpp.create({
        session: 'Scarlat',
        headless: true,
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));

function start(client) {
    module.exports.client = client
    client.onMessage(async (message) => {
        if (!message.isGroupMsg && message.from != "status@broadcast") {

            let arrumarbody = {
                identifier: message.from.replace("@c.us", ""),
                message: await getType(client, message),
                name: message.notifyName,
                provider: "whats_wpp",
                type: message.type,
            }
            meuEmitter.emit("message", arrumarbody)
        }


    });
}