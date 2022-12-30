const {REG} = require("./utils");
const {downloadFromYoutube, downloadFromSoundcloud} = require("./api/download");
const {youtubeInfo} = require("./api/downloader");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        return await youtubeInfo(ctx);

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await downloadFromSoundcloud(ctx);

    });

    bot.action('download_youtube', async (ctx) => {

        return await downloadFromYoutube(ctx);

    });

}

module.exports = {
    start,
}