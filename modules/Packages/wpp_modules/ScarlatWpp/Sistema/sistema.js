const wpp = require('@wppconnect-team/wppconnect');
const meuEmitter = require("../../../../Events/Emitter");

wpp.create({
        session: 'Scarlat',
        headless: true, 
        devtools: false, 
        useChrome: true, 
        debug: false, 
        logQR: false, 
        browserWS: '',
        browserArgs: [''], 
        puppeteerOptions: {}, 
        disableWelcome: false, 
        updatesLog: false, 
        autoClose: 60000,
        tokenStore: 'file', 
        folderNameToken: './tokens',
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));

function start(client) {
    module.exports = client
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