const express = require('express');
const { Telegraf } = require("telegraf");

const BOT_KEY = '5836436547:AAE_Z-6MpCP-bVp3r96M8XhFIMCGxNJgKvk';

const bot = new Telegraf(BOT_KEY);

const app = express();

bot.command("cat", ctx => ctx.reply('Hello!'));

bot.launch();

app.listen(process.env.PORT || 3000);