const {REG, waitForSent, getUrlBuffers, replyOptions, isMember} = require("./utils");
const {downloadPin} = require("./utils/pinterest");
const {findTrack, downloadResults} = require("./utils/youtube-music");
const {getMusicMetaData} = require("./utils/apple-music");
const Spotify = require('./utils/spotify');
const {soundCloudDownloader} = require("./utils/sound-cloud");
const {Input} = require('telegraf');
const {makeID, HOST} = require("./utils");
const {twitterDownloader} = require("./utils/twitter");
const {youtubeDownloader, ytdlCallback} = require("./utils/yt");
const {instagramDownloader} = require("./utils/instagram");
const tikTokDownloader = require("./utils/tiktok");
const {facebookDownloader} = require("./utils/facebook");

function start(bot) {

    bot.hears(REG.url, async (ctx) => {

        let url = ctx.message.text;

        const sl = makeID(6);

        global.sl[sl] = `https://fun-tech.vercel.app/tools/downloader?url=${url}`;

        const shortURL = `${HOST}/red/${sl}`;

        return await ctx.reply('Click the Get Link button to see the download links inside our website:',
            {
                ...replyOptions,
                reply_to_message_id: ctx.message.message_id,
                reply_markup: {
                    inline_keyboard: [{
                        text: 'Get Link',
                        url: shortURL,
                    }],
                },
            }
        );

    });

    return;

    bot.hears(REG.youtube, async (ctx) => {

        return await waitForSent(bot, ctx, async (ctx) => {

            const yd = await ytdlCallback(ctx);

            return await ctx.replyWithPhoto({url: yd.thumb},
                {
                    ...replyOptions,
                    reply_to_message_id: ctx.message.message_id,
                    reply_markup: {
                        inline_keyboard: yd.dataArray,
                    }, caption: yd.caption,
                }
            );

        });

    });

    bot.hears(REG.soundcloud, async (ctx) => {

        return await waitForSent(bot, ctx, async ctx => {

            let url = ctx.message.text;

            url = url.replace('m.soundcloud.com', 'soundcloud.com');

            const scd = await soundCloudDownloader(url);

            return await ctx.sendAudio(Input.fromReadableStream(scd.stream),
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

        return await waitForSent(bot, ctx, async (ctx) => {

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

        return await waitForSent(bot, ctx, async (ctx) => {

            let url = ctx.message.text;

            const res = await tikTokDownloader(url);

            return await ctx.sendVideo(Input.fromBuffer(await getUrlBuffers(res.stream)), {
                ...replyOptions,
                caption: res.title,
                // duration: res.duration,
                thumb: Input.fromBuffer(await getUrlBuffers(res.thumb)),
            });

        });
    });

    bot.hears(REG.facebook, async (ctx) => {

        return await waitForSent(bot, ctx, async (ctx) => {

            let url = ctx.message.text;

            const fd = await facebookDownloader(url);

            let dataArray = [];

            for (let down of fd) {

                const {quality, url: link} = down;

                const key = makeID(6);

                global.sl[key] = link;

                dataArray.push([{
                    text: `🎬🎶 ${quality}`,
                    url: `${HOST}/red/${key}`,
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

        return await waitForSent(bot, ctx, async (ctx) => {

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
                    url: `${HOST}/red/${key}`,
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

        return await waitForSent(bot, ctx, async (ctx) => {

            const url = ctx.message.text;

            const {video, image} = await downloadPin(url);

            if (video) {

                return await ctx.sendVideo(Input.fromURL(video), {
                    ...replyOptions,
                    thumb: Input.fromBuffer(await getUrlBuffers(image)),
                });

            }

            return await ctx.replyWithPhoto(Input.fromURL(image), replyOptions);

        });

    });

    bot.hears(REG.appleMusic, async (ctx) => {

        return await waitForSent(bot, ctx, async (ctx) => {

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

            return await ctx.sendAudio(results[0].musicStream,
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

        return await waitForSent(bot, ctx, async (ctx) => {

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

            return await ctx.sendAudio(results[0].musicStream,
                {
                    ...replyOptions,
                    thumb: results[0].thumbStream,
                    title,
                    performer: artists[0].name,
                    duration: duration.totalSeconds,
                });

        });

    });

    bot.hears(/music (.*)/i, async (ctx) => {

        return await waitForSent(bot, ctx, async (ctx) => {

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

            return await ctx.sendAudio(results[0].musicStream,
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
            "<b>Welcome to FunTech Bot!</b>\n We have a lot of tools and we are going to add a lot of other tools! To start, you can see the list of commands and their descriptions with the /help command, or use the menus below"
            , replyOptions);

        await isMember(bot, ctx);

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

    bot.action(/download_yt (.*)/, async (ctx) => {

        const params = ctx.match[1].split(' ');

        const ID = params[0], ITAG = params[1];

        const ytdlRes = await youtubeDownloader(ID, ITAG);

        if (ytdlRes.hasVideo) {

            return await ctx.sendVideo(Input.fromReadableStream(ytdlRes.stream), {
                ...replyOptions,
                title: ytdlRes.title,
                thumb: Input.fromBuffer(await getUrlBuffers(ytdlRes.thumb)),
                duration: ytdlRes.lengthSeconds,
            });

        }

        return await ctx.sendAudio(Input.fromReadableStream(ytdlRes.stream), {
            ...replyOptions,
            title: ytdlRes.title,
            thumb: Input.fromBuffer(await getUrlBuffers(ytdlRes.thumb)),
            duration: ytdlRes.lengthSeconds,
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