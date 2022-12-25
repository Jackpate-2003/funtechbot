const express = require('express');
const { Telegraf } = require("telegraf");

const BOT_KEY = '5836436547:AAE_Z-6MpCP-bVp3r96M8XhFIMCGxNJgKvk';
const secret = '/' + 'Rgrthdsjfdvbf31rc';

const HOST = 'https://beige-seal-wear.cyclic.app';

const bot = new Telegraf(BOT_KEY);

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(bot.webhookCallback(`${secret}`));

bot.command("cat", ctx => ctx.reply('Hello!'));

bot.telegram.setWebhook(`${HOST}/${secret}`);

app.listen(process.env.PORT || 3000, () => {

    console.log('I\'m ready!');

});