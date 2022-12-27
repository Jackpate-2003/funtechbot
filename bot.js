const downloader = require('./api/downloader');
const download = require('./api/download');
const {REG} = require("./utils");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        await downloader(ctx, ctx.match[1]);

    });

    bot.hears(/download_(.*)/, async (ctx) => {

        console.log('HERE!', ctx.match)

        await download(ctx, ctx.match);

    });

}

module.exports = {
    start,
}