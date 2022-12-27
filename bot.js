const Downloader = require('./api/downloader');
const download = require('./api/download');
const {REG} = require("./utils");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        const downloader = new Downloader(ctx);

        await downloader.youtube();

    });

    bot.hears(/download_(.*)/, async (ctx) => {

        console.log('HERE!', ctx.match)

        await download(ctx, ctx.match[0]);

    });

}

module.exports = {
    start,
}