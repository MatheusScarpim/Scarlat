import * as dotenv from 'dotenv';
dotenv.config();

const StartModules = require("./modules/start");
const meuEmitter = require('./modules/Events/Emitter');
const webhook = require('./assets/Host/serverReturns/webhook/webhook');
const Hospedagem = require('./assets/Host/HostExpress');
import {
    generateId
} from "./modules/Conversations/generateConversations";

const filaDeMensagens : any = [];

let processandoFila = false;

meuEmitter.on('message', async (message: any) => {
    filaDeMensagens.push(message);
    await processarFila();
  });
  
  async function processarFila(): Promise<void> {
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