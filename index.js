const express = require('express');
const {Telegraf, session} = require("telegraf");
const BodyParser = require("body-parser");
const {start} = require('./bot');
const S3 = require('./db/s3');
const {HOST, baseUploadPath} = require("./utils");
const path = require("path");
// const LocalSession = require('telegraf-session-local');

// Globals
if (!global.sl) {
    global.sl = {};
}

const BOT_KEY = '5836436547:AAG_M6qhVvQkFlBSoR8eQuGH3tJ85cujbA4';

const bot = new Telegraf(BOT_KEY /*{
    /!*telegram: {
        apiRoot: 'http://67.219.139.52:8081'
    }*!/
}*/);

const app = express();

(async () => {

    app.use(await bot.createWebhook({domain: `${HOST}`}));

    bot.use(session());

// bot.use((new LocalSession({ database: 'ls.json' })).middleware())

    try {

        start(bot);

    } catch (err) {

        console.error('ERROR!!', err);

    }

    app.get('/red/:id', async (req, res) => {

        const {id} = req.params;

        const url = global.sl[id];

        if (!url) {

            return res.send('The link has expired!');

        }

        return res.redirect(url);

    });

    app.use(express.static(path.join(__dirname, baseUploadPath)));

    app.listen(process.env.PORT, () => {

        console.log('I\'m ready!');

    });

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

})();

/*setInterval(async () => {
    await remove2HoursFiles();
}, 5 * 60 * 1000);*/