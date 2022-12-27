const Downloader = require('./api/downloader');
const download = require('./api/download');
const {REG} = require("./utils");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        const downloader = new Downloader(ctx);

        await downloader.youtube();

    });

    bot.hears('test', async (ctx) => {
        await ctx.reply('HERE!')
    });

    bot.action(/download_(.*)/, async (ctx) => {

        await download(ctx, ctx.match[0]);

    });

}

module.exports = {
    start,
}