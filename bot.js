const {REG} = require("./utils");
const {downloadFromYoutube, downloadFromSoundcloud, downloadFromInstagram, downloadFromTiktok, downloadFromFacebook,
    downloadFromTwitter
} = require("./api/download");
const {youtubeInfo} = require("./api/downloader");
const {getListVideoByUsername, getVideoNoWM} = require("./utils/tiktok");
const {downloadPin} = require("./utils/pinterest");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        return await youtubeInfo(ctx);

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await downloadFromSoundcloud(ctx);

    });

    bot.hears(REG.instagram, async (ctx) => {

        return await downloadFromInstagram(ctx);

    });

    bot.hears(REG.tiktok, async (ctx) => {

        return await downloadFromTiktok(ctx);

        if (url.includes('@')) {

            let afterUsername = url.substring(url.indexOf('@')).split('/');

            if (
                !afterUsername[1]
            ) {

                links = await getListVideoByUsername(url);

            }

        }

        if (!links) {
            links = await getVideoNoWM(url);
        }

        for (let lk of links) {

            await ctx.sendDocument(lk);

        }

        return ctx;

    });

    bot.hears(REG.facebook, async (ctx) => {

        return await downloadFromFacebook(ctx);

    });

    bot.hears(REG.twitter, async (ctx) => {

        return await downloadFromTwitter(ctx);

    });

    bot.hears(REG.pinterest, async (ctx) => {

        return await downloadPin(ctx);

    });

    bot.action('download_youtube', async (ctx) => {

        return await downloadFromYoutube(ctx);

    });

}

module.exports = {
    start,
}