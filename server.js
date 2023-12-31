require('dotenv').config();
const StartModules = require("./modules/EventsModules/startModules")
const meuEmitter = require('./modules/EventsModules/Eventos/Emitter');
const webhook = require('./assets/ServerReturn/webhook/webhook')
const Hospedagem = require('./assets/Hospedagem/HospedaExpress')

meuEmitter.on('message', (message) => {
    webhook.dispararHook(message)
})