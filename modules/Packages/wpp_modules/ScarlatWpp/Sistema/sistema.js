const wpp = require('@wppconnect-team/wppconnect');
const meuEmitter = require("../../../../Events/Emitter");
const path = require('path');
const {
    getType
} = require('../utils/utils');

wpp.create({
        session: 'Scarlat',
        headless: true,
        puppeteerOptions: {},
        disableWelcome: false,
        autoClose: 60000,
        tokenStore: 'file',
        folderNameToken: './tokens',
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));

function start(client) {
    module.exports.client = client
    client.onMessage(async (message) => {
        if (!message.isGroupMsg) {
            const dataHora = new Date(message.timestamp * 1000);

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
    client.onIncomingCall((callback) => {
        console.log(callback)
    });
}