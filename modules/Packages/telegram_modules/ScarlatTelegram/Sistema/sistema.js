const meuEmitter = require("../../../../Events/Emitter")
const telegraf = require("telegraf");
const utils = require("../utils/utils");

const token = process.env.TOKEN_TELEGRAM

const bot = new telegraf.Telegraf(token);


bot.start((ctx) => {
    ctx.reply('Hello! I am your bot.');
});

bot.on("message", async (ctx) => {
    let getMessage = await utils.getType(ctx.telegram, ctx.update.message)
    let name = ctx.update.message.from.first_name || '';
    let idUser = ctx.update.message.from.id || 0;

    let data = {
        message: getMessage.message,
        name: name,
        identifier: idUser,
        provider: "telegram",
        type: getMessage.type
    };

    meuEmitter.emit('message', data);
});

bot.launch();

async function sendFile(identifier, base64, fileName, type) {
    if (type == "image") {
        bot.telegram.sendPhoto(identifier, utils.getBuffer(base64, fileName, type))
    } else if (type == "document") {
        bot.telegram.sendDocument(identifier, utils.getBuffer(base64, fileName, type))
    } else if (type == "ppt") {
        bot.telegram.sendAudio(identifier, await utils.getBuffer(base64, fileName, type))
    }
}

module.exports.sendFile = sendFile
module.exports.bot = bot