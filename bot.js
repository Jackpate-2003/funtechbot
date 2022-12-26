const downloader = require('./api/downloader');

module.exports = function (bot) {

    bot.on('text', async (ctx) => {

        const text = ctx.message.text;

        const DOWNLOADER = await downloader(ctx, text);

        console.log('Down', DOWNLOADER)

        if (
            DOWNLOADER
        ) {
            return DOWNLOADER;
        }

    });

}