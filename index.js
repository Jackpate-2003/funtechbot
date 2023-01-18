const express = require('express');
const {Telegraf, session} = require("telegraf");
const BodyParser = require("body-parser");
const {start} = require('./bot');
const S3 = require('./db/s3');
const {HOST} = require("./utils");
const Mysql = require("./db/mysql");
const {baseUploadPath, isExists, remove2HoursFiles} = require("./api/uploader");
const path = require("path");
// const LocalSession = require('telegraf-session-local');

// Globals
if (!global.sl) {
    global.sl = {};
}

const BOT_KEY = '5836436547:AAE_Z-6MpCP-bVp3r96M8XhFIMCGxNJgKvk';

const bot = new Telegraf(BOT_KEY, /*{
    /!*telegram: {
        apiRoot: 'http://67.219.139.52:8081'
    }*!/
}*/);

const app = express();

app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true,
    })
);

bot.use(session());

// bot.use((new LocalSession({ database: 'ls.json' })).middleware())
try {

    start(bot);
} catch (err) {

    console.error('ERROR!!', err);

}

bot.launch();

app.get("/", (req, res) => res.send("Hello!"));

app.get('/red', async (req, res) => {

    const {id} = req.query;

    const url = global.sl[id];

    if (!url) {

        return res.send('The link has expired!');

    }

    return res.redirect(url);

});

app.use(express.static(path.join(__dirname, baseUploadPath)));

app.use(bot.webhookCallback(secret));

app.listen(process.env.PORT || 3000, () => {

    console.log('I\'m ready!');

});

setInterval(async () => {
    await remove2HoursFiles();
}, 5 * 60 * 1000);

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))