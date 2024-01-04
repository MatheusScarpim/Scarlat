import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';
const meuEmitter= require( "../../../../Events/Emitter")
import { Telegraf, Context } from "telegraf";

const token: string = "6728340092:AAEHNLaBGyxbgd-F8Vhzp58j9iYfRkaOMPs";

const bot = new Telegraf(token);

// Handle the /start command
bot.start((ctx: Context) => {
    // You can access the chat ID using ctx.chat?.id
    ctx.reply('Hello! I am your bot.');
});

// Listen for text messages
bot.on("text", async (ctx: any) => {
    let messageText: string = ctx.update.message.text;
    let name: string = ctx.update.message.from.first_name || '';
    let idUser: number = ctx.update.message.from.id || 0;

    let data = {    
        message: messageText,
        name: name,
        Number: idUser,
        system: "telegram"
    };

    meuEmitter.emit('message', data);
});

bot.launch();
