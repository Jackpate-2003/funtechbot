const downloader = require('./api/downloader');

module.exports = function (bot) {

    bot.on('text', async (ctx) => {

        const text = ctx.message.text;

        if(
            await downloader(ctx, text)
        ) {
            return null;
        }

    });

}