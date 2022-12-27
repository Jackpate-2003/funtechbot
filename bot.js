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

module.exports = {
    start,
}