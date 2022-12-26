const downloader = require('./api/downloader');
const download = require('./api/download');

module.exports = function (bot) {

    bot.on('text', async (ctx) => {

        const text = ctx.message.text;

        const DOWNLOADER = await downloader(ctx, text);

        if (
            DOWNLOADER
        ) {
            return DOWNLOADER;
        }

        const DOWNLOAD = await download(ctx, text);

        if(
            DOWNLOAD
        ) {
            return DOWNLOAD;
        }

    });

}