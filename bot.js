const Downloader = require('./api/downloader');
const download = require('./api/download');
const {REG} = require("./utils");
const {downloadFromYoutube} = require("./api/download");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        const downloader = new Downloader(ctx);

        await downloader.youtube();

    });

    bot.action('download_youtube', async (ctx) => {

        await downloadFromYoutube()

    });

}

module.exports = {
    start,
}