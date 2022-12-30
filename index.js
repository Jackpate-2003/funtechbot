const express = require('express');
const {Telegraf, session} = require("telegraf");
const BodyParser = require("body-parser");
const {start} = require('./bot');
const S3 = require('./db/s3');
const {HOST} = require("./utils");
// const LocalSession = require('telegraf-session-local');

const BOT_KEY = '5836436547:AAE_Z-6MpCP-bVp3r96M8XhFIMCGxNJgKvk';

const bot = new Telegraf(BOT_KEY);

const app = express();

const secret = `/tel/${bot.secretPathComponent()}`;

bot.telegram.setWebhook(`${HOST}/${secret}`)
    .then((status) => console.log('Webhook setted: ' + status))
    .catch(err => console.log("ERR", err));

app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true,
    })
);

bot.use(session());

// bot.use((new LocalSession({ database: 'ls.json' })).middleware())

start(bot);

app.get("/", (req, res) => res.send("Hello!"));

app.get('/red', async (req, res) => {

    const { id } = req.query;

    const s3 = new S3();

    const url = await s3.getObj(String(id));

    if(!url) {

        return res.send('The link has expired!');

    }

    return res.redirect(url);

});

app.use(bot.webhookCallback(secret));

app.listen(process.env.PORT || 3000, () => {

    console.log('I\'m ready!');

});

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))