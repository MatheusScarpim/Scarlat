const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const meuEmitter = require("../../../EventsModules/Eventos/Emitter");

const {
    Telegraf
} = require("telegraf");
const {
    message
} = require("telegraf/filters");


let token = "6728340092:AAEHNLaBGyxbgd-F8Vhzp58j9iYfRkaOMPs"

const bot = new Telegraf(token)

bot.on(message("text"), async (ctx) => {
    let message = ctx.update.message.text;
    let name = ctx.update.message.from.first_name;
    let idUser = ctx.update.message.from.id
    let data = {
        message: message,
        name: name,
        Number: idUser,
        system: "telegram"
    }
    meuEmitter.emit('message', data);
})

bot.launch()




// Export the router
module.exports = router;