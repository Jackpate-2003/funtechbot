const {REG, waitForSent} = require("./utils");
const {
    downloadFromYoutube, downloadFromSoundcloud, downloadFromInstagram, downloadFromTiktok, downloadFromFacebook,
    downloadFromTwitter
} = require("./api/download");
const {youtubeInfo} = require("./api/downloader");
const {getListVideoByUsername, getVideoNoWM} = require("./utils/tiktok");
const {downloadPin} = require("./utils/pinterest");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        return await waitForSent(ctx, youtubeInfo);

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await waitForSent(ctx, downloadFromSoundcloud);

    });

    bot.hears(REG.instagram, async (ctx) => {

        return await waitForSent(ctx, downloadFromInstagram);

    });

    bot.hears(REG.tiktok, async (ctx) => {

        return await waitForSent(ctx, downloadFromTiktok);

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

        return await waitForSent(ctx, downloadFromFacebook);

    });

    bot.hears(REG.twitter, async (ctx) => {

        return await waitForSent(ctx, downloadFromTwitter);

    });

    bot.hears(REG.pinterest, async (ctx) => {

        return await waitForSent(ctx, downloadPin);

    });

    const DOWNLOADER_MSG = 'To download from Youtube, Instagram, TikTok, Twitter, Facebook, Pinterest and Soundcloud, just enter the link of the content you want to download!';

    // DESC HEARS
    bot.hears('Downloader', async (ctx) => {

        await ctx.reply(DOWNLOADER_MSG);

    });

    bot.start(async (ctx) => {

        await ctx.reply(
            "<b>Welcome to FunTech Bot!</b>\n We have a lot of tools and we are going to add a lot of other tools! To start, you can see the list of commands and their descriptions with the /help command, or use the menus below."
            , {
                "reply_markup": {
                    "resize_keyboard": true,
                    "keyboard": [
                        ["Downloader"],
                    ]
                }, parse_mode: 'HTML',
            })
    });

    // Commands
    bot.command('help', async (ctx) => {

        await ctx.reply(`
    ${DOWNLOADER_MSG}\n
    <b>/help</b>  <i>List of commands</i>
    <b>/funtech</b>  <i>About us</i>
    `, {
            parse_mode: 'HTML',
            reply_to_message_id: ctx.message.message_id,
        })

    });

    bot.command('funtech', async (ctx) => {

        await ctx.reply(`
        FunTech is a practical collection of various entertainment, scientific and IT tools.\n
        <a href="https://www.youtube.com/@fun--tech">Youtube channel: @fun--tech</a> 
        <a href="https://t.me/+qGGw48DBe000NDc0">Telegram channel: Fun Tech!</a>
        `, {
            parse_mode: 'HTML',
            reply_to_message_id: ctx.message.message_id,
        });

    });

    bot.action('download_youtube', async (ctx) => {

        return await downloadFromYoutube(ctx);

    });

    bot.telegram.setMyCommands([
        {command: "help", description: "List of commands"},
        {command: "funtech", description: "About & contact us"},
    ]);

}

module.exports = {
    start,
}