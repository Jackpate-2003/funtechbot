const downloader = require('./api/downloader');
const download = require('./api/download');

function start(bot) {

    bot.on('text', async (ctx) => {

        const text = ctx.message.text;

        const DOWNLOADER = await downloader(ctx, text);

        if (
            DOWNLOADER
        ) {
            return DOWNLOADER;
        }

    });

    bot.hears(/download_.*?/, async (ctx) => {

        const DOWNLOAD = await download(ctx, text);

        if (
            DOWNLOAD
        ) {
            return DOWNLOAD;
        }

    });

}

function getSession(ctx, key) {

    if (ctx.session) {
        return ctx.session[key];
    }

}

function setSession(ctx, key, value, parent) {

    if (!ctx.session) {
        ctx.session = {};
    }

    if (parent) {
        if (!ctx.session[parent]) {
            ctx.session[parent] = {};
        }
        return ctx.session[parent][key] = value;
    }

    ctx.session[key] = value;

}

module.exports = {
    start, getSession, setSession,
}