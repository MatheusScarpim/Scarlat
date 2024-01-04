import * as dotenv from 'dotenv';
dotenv.config();

const StartModules = require("./modules/start");
const meuEmitter = require('./modules/Events/Emitter');
const webhook = require('./assets/Host/serverReturns/webhook/webhook');
const Hospedagem = require('./assets/Host/HostExpress');

// Define a listener for the 'message' event
meuEmitter.on('message', (message: any) => {
    console.log(message);
    webhook.dispararHook(message);
});

