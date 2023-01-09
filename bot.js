const {REG, waitForSent, setSession, getSession} = require("./utils");
const {
    downloadFromYoutube, downloadFromInstagram, downloadFromTiktok, downloadFromFacebook,
    downloadFromTwitter,
} = require("./api/download");
const {youtubeInfo} = require("./api/downloader");
const {getListVideoByUsername, getVideoNoWM} = require("./utils/tiktok");
const {downloadPin} = require("./utils/pinterest");
const Mysql = require('./db/mysql');
const {findTrack, downloadResults} = require("./utils/youtube-music");
const {getMusicMetaData} = require("./utils/apple-music");
const Spotify = require('./utils/spotify');
const {soundCloudDownloader} = require("./utils/sound-cloud");

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        return await waitForSent(ctx, youtubeInfo);

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await waitForSent(ctx, soundCloudDownloader);

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

    bot.hears(REG.appleMusic, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            const trackID = await getMusicMetaData(ctx.message.text);

            const tracks = await findTrack(trackID);

            let {
                title, artists, thumbnailUrl, youtubeId, duration,
            } = tracks[0];

            const results = await downloadResults([{
                id: youtubeId,
                thumb: thumbnailUrl,
            }]);

            title = `${title} by ${artists[0].name}`;

            return await ctx.replyWithAudio(results[0].musicStream,
                {
                    thumb: results[0].thumbStream,
                    title,
                    performer: artists[0].name,
                    duration: duration.totalSeconds,
                });

        });

    });

    bot.hears(REG.spotify, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            let trackID = await Spotify.getMusicMetaData(ctx.message.text);

            const tracks = await findTrack(trackID);

            let {
                title, artists, thumbnailUrl, youtubeId, duration,
            } = tracks[0];

            const results = await downloadResults([{
                id: youtubeId,
                thumb: thumbnailUrl,
            }]);

            title = `${title} by ${artists[0].name}`;

            return await ctx.replyWithAudio(results[0].musicStream,
                {
                    thumb: results[0].thumbStream,
                    title,
                    performer: artists[0].name,
                    duration: duration.totalSeconds,
                });

        });

    });

    bot.hears(/music (.*)/, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            const tracks = await findTrack(ctx.match[1]);

            if (!tracks.length) {

                return await ctx.reply('Music not found!');

            }

            let {
                title, artists, thumbnailUrl, youtubeId,
                duration,
            } = tracks[0];

            const results = await downloadResults([{
                id: youtubeId,
                thumb: thumbnailUrl,
            }]);

            title = `${title} by ${artists[0].name}`;

            return await ctx.replyWithAudio(results[0].musicStream,
                {
                    thumb: results[0].thumbStream,
                    title,
                    performer: artists[0].name,
                    duration: duration.totalSeconds,
                });

        });

    });

    const DOWNLOADER_MSG = 'To download from Youtube, Instagram, TikTok, Twitter, Facebook, Pinterest, Soundcloud, Spotify, Apple Music, Youtube Music, just enter the link of the content you want to download!';
    const MUSIC_DOWNLOADER_DESC =
        'By typing music followed by the name or lyrics of a song, that song will be sent to you. For example: <code>music rap god eminem</code>';

    // DESC HEARS
    bot.hears('Downloader', async (ctx) => {

        await ctx.reply(DOWNLOADER_MSG);

    });

    bot.hears("Download song with its name or lyrics", async (ctx) => {

        await ctx.reply(MUSIC_DOWNLOADER_DESC, {
            parse_mode: 'HTML',
        });

    });

    bot.start(async (ctx) => {

        await ctx.reply(
            "<b>Welcome to FunTech Bot!</b>\n We have a lot of tools and we are going to add a lot of other tools! To start, you can see the list of commands and their descriptions with the /help command, or use the menus below.\n<b>Please subscribe to <a href=\"https://t.me/funs_tech\">our channel: FunTech</a> to get the latest news and features, PRO features, promotions, etc</b>"
            , {
                "reply_markup": {
                    "resize_keyboard": true,
                    "keyboard": [
                        ["Downloader"],
                        ["Download song with its name or lyrics"]
                    ]
                }, parse_mode: 'HTML',
            })
    });

    // Commands
    bot.command('cancel', async (ctx) => {

        ctx.session = null;


    });

    bot.command('help', async (ctx) => {

        await ctx.reply(`
    ${DOWNLOADER_MSG}\n
    ${MUSIC_DOWNLOADER_DESC}\n
    <b>/help</b>  <i>List of commands</i>
    <b>/funtech</b>  <i>About us</i>
    <b>/support</b> <i>Report a problem or request to add a tool</i>
    `, {
            parse_mode: 'HTML',
            reply_to_message_id: ctx.message.message_id,
        })

    });

    bot.command('funtech', async (ctx) => {

        await ctx.reply(`
        FunTech is a practical collection of various entertainment, scientific and IT tools.\n
        <a href="https://www.youtube.com/@fun--tech">Youtube channel: @fun--tech</a> 
        <a href="https://t.me/funs_tech">Telegram channel: Fun Tech!</a>
        `, {
            parse_mode: 'HTML',
            reply_to_message_id: ctx.message.message_id,
        });

    });

    bot.command('support', async (ctx) => {

        await ctx.reply(`
        Please contact <a href="tg://user?id=1407206551">@BLACKS_SOULS</a>,
         or send your issue to funny.tech.2021@gmail.com.
        <a href="tg://user?id=1407206551">Youtube channel: @fun--tech</a>
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
        {
            command: "support",
            description: "Let support know if there is a problem with the bot or if you have a request to add a tool"
        },
    ]);

}

module.exports = {
    start,
}