const wpp = require('@wppconnect-team/wppconnect');
const meuEmitter = require("../../../../Events/Emitter");
const {
    getType,
    getBase64Image
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
        if (
          !message.isGroupMsg &&
          message.from !== 'status@broadcast' &&
          message.type !== 'gp2' &&
          message.type !== 'ciphertext' &&
          message.type !== 'e2e_notification'
        ) {
          const returnType = await getType(client, message)
          const arrumarbody = {
            identifier: message.from.replace('@c.us', ''),
            // eslint-disable-next-line no-undef
            message: await returnType.message,
            name: message.notifyName,
            provider: 'whats_wpp',
            type: returnType.type,
            // eslint-disable-next-line no-undef
            photo: await getBase64Image(client, message.from),
          }
          meuEmitter.emit('message', arrumarbody)
        }
      })
}