const {REG, waitForSent, setSession, getSession, getUrlBuffers} = require("./utils");
const {downloadPin} = require("./utils/pinterest");
const {findTrack, downloadResults} = require("./utils/youtube-music");
const {getMusicMetaData} = require("./utils/apple-music");
const Spotify = require('./utils/spotify');
const {soundCloudDownloader} = require("./utils/sound-cloud");
const {Input} = require('telegraf');
const {replyOptions} = require("./utils/bot");
const {makeID, HOST} = require("./utils");
const {twitterDownloader} = require("./utils/twitter");
const {youtubeDownloader} = require("./utils/yt");
const {instagramDownloader} = require("./utils/instagram");
const {tikTokDownloader} = require("./utils/tiktok");
const {facebookDownloader} = require("./utils/facebook");


function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            const yd = await youtubeDownloader(ctx);

            return await ctx.replyWithPhoto({url: yd.thumb},
                {
                    ...replyOptions,
                    reply_to_message_id: ctx.message.message_id,
                    reply_markup: {
                        inline_keyboard: yd.dataArray,
                        ...replyOptions.reply_markup,
                    }, caption: yd.caption,
                }
            );

        });

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await waitForSent(ctx, async ctx => {

            const url = ctx.message.text;

            const scd = await soundCloudDownloader(url);

            return await ctx.replyWithAudio(Input.fromReadableStream(scd.stream),
                {
                    thumb: Input.fromBuffer(scd.thumb),
                    title: scd.title,
                    performer: scd.performer,
                    duration: scd.duration,
                    ...replyOptions,
                });

        });

    });

    bot.hears(REG.instagram, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            let url = ctx.message.text;

            const id = await instagramDownloader(url);

            for (let ul of id) {

                await ctx.sendDocument(ul, {
                    ...replyOptions,
                });

            }

        });

    });

    bot.hears(REG.tiktok, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            let url = ctx.message.text;

            const td = await tikTokDownloader(url);

            for (let lk of td) {

                await ctx.sendDocument(lk, {
                    ...replyOptions,
                });

            }

        });
    });

    bot.hears(REG.facebook, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            let url = ctx.message.text;

            const fd = await facebookDownloader(url);

            let dataArray = [];

            for (let down of fd) {

                const {quality, url: link} = down;

                const key = makeID(6);

                global.sl[key] = link;

                dataArray.push([{
                    text: `🎬🎶 ${quality}`,
                    url: `${HOST}/red?id=${key}`,
                }]);

            }

            return await ctx.reply('Video qualities for download:',
                {
                    ...replyOptions,
                    reply_to_message_id: ctx.message.message_id,
                    reply_markup: {
                        inline_keyboard: dataArray,
                    },
                }
            );

        });

    });

    bot.hears(REG.twitter, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            let url = ctx.message.text;

            const td = await twitterDownloader(url);

            for (let down of td.download) {

                const key = makeID(6);

                const {
                    dimension, url,
                } = down;

                global.sl[key] = url;

                dataArray.push([{
                    text: `🎬🎶 (${dimension})`,
                    url: `${HOST}/red?id=${key}`,
                }]);

            }

            return await ctx.reply(td.user.text,
                {
                    ...replyOptions,
                    reply_to_message_id: ctx.message.message_id,
                    reply_markup: {
                        inline_keyboard: dataArray,
                    },
                }
            );

        });

    });

    bot.hears(REG.pinterest, async (ctx) => {

        return await waitForSent(ctx, async (ctx) => {

            const url = ctx.message.text;

            const {video, image} = await downloadPin(url);

            if (video) {

                return await ctx.replyWithVideo(Input.fromURL(video), {
                    ...replyOptions,
                    thumb: Input.fromBuffer(await getUrlBuffers(image)),
                });

            }

            return await ctx.replyWithPhoto(Input.fromURL(image), replyOptions);

        });

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
                    ...replyOptions,
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
                    ...replyOptions,
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
                    ...replyOptions,
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

        await ctx.reply(DOWNLOADER_MSG, replyOptions);

    });

    bot.hears("Download song with its name or lyrics", async (ctx) => {

        await ctx.reply(MUSIC_DOWNLOADER_DESC, replyOptions);

    });

    bot.start(async (ctx) => {

        await ctx.reply(
            "<b>Welcome to FunTech Bot!</b>\n We have a lot of tools and we are going to add a lot of other tools! To start, you can see the list of commands and their descriptions with the /help command, or use the menus below.\n<b>Please subscribe to <a href=\"https://t.me/funs_tech\">our channel: FunTech</a> to get the latest news and features, PRO features, promotions, etc</b>"
            , replyOptions)
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
            ...replyOptions,
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
            ...replyOptions,
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
            ...replyOptions,
        });

    });

    bot.action('download_yt', async (ctx) => {

        const ms = getSession(ctx, 'yt', 'downloader');

        return await ctx.replyWithAudio(Input.fromBuffer(await getUrlBuffers(ms.url)),
            {
                ...replyOptions,
                thumb: Input.fromBuffer(await getUrlBuffers(ms.thumb)),
                title: ms.title,
                duration: ms.lengthSeconds,
            });

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