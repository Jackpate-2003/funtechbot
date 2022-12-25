const express = require('express');
const {Telegraf} = require("telegraf");
const BodyParser = require("body-parser");

const BOT_KEY = '5836436547:AAE_Z-6MpCP-bVp3r96M8XhFIMCGxNJgKvk';

const HOST = 'https://beige-seal-wear.cyclic.app';

const bot = new Telegraf(BOT_KEY);

const app = express();

const secret = `/tel/${bot.secretPathComponent()}`;

bot.telegram.setWebhook(`${HOST}/${secret}`)
    .then((status) => console.log('Webhook setted: ' + status))
    .catch(err => console.log("ERR", err));

console.log('Secret path', `${HOST}/${secret}`)

bot.command("text", async (ctx) => {

    console.log("Reply!");

    ctx.reply('Hello!')
});

app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => res.send("Hello!"));

app.use(bot.webhookCallback(secret));

app.listen(process.env.PORT || 3000, () => {

    console.log('I\'m ready!');

});

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))