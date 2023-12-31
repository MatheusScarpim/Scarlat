const wpp = require('@wppconnect-team/wppconnect');
const meuEmitter = require("../../../EventsModules/Eventos/Emitter");

wpp.create({
        session: 'store',
        multidevice: true,
        headless: true,
        updatesLog: true,
        debug: true,
    })
    .then((client) => {
        start(client);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

function start(client) {
    client.onMessage((message) => {
        if (!message.isGroupMsg) {
            let arrumarbody = {
                number: message.from.replace("@c.us", ""),
                message: message.body,
                name: message.notifyName,
                system: "whats_wpp"
            }
            meuEmitter.emit("message", arrumarbody)
        }
    });
};