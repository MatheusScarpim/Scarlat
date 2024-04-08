const dotenv = require('dotenv');
dotenv.config();

const StartModules = require("./modules/start");
const meuEmitter = require('./modules/Events/Emitter');
const webhook = require('./assets/Host/serverReturns/webhook/webhook');
const Hospedagem = require('./assets/Host/HostExpress');
const { generateId } = require("./modules/Conversations/generateConversations");

const filaDeMensagens = [];

let processandoFila = false;

meuEmitter.on('message', async (message) => {
    filaDeMensagens.push(message);
    await processarFila();
});
  
async function processarFila() {
    if (processandoFila) {
        return;
    }

    processandoFila = true;

    try {
        while (filaDeMensagens.length > 0) {
            const message = filaDeMensagens.shift();
            if (!message) {
                console.error('Mensagem inválida na fila');
                continue;
            }

            let data = await generateId(message, "U");
            await webhook.dispararHook(data, message);
        }
    } catch (error) {
        console.error('Erro ao processar fila:', error);
    } finally {
        processandoFila = false;
    }
}
