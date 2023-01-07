const {REG, waitForSent} = require("./utils");
const {
    downloadFromYoutube, downloadFromSoundcloud, downloadFromInstagram, downloadFromTiktok, downloadFromFacebook,
    downloadFromTwitter
} = require("./api/download");
const {youtubeInfo} = require("./api/downloader");
const {getListVideoByUsername, getVideoNoWM} = require("./utils/tiktok");
const {downloadPin} = require("./utils/pinterest");
const Mysql = require('./db/mysql');
const {findTrack, downloadResults} = require("./utils/youtube-music");
const {getMusicMetaData} = require("./utils/apple-music");

function start(bot) {

    const mySql = new Mysql();

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

    bot.hears(REG.appleMusic, async (ctx) => {

        const trackMetaData = await getMusicMetaData(ctx.message.text);

        const tracks = await findTrack(trackMetaData.title);

        console.log('t', tracks)

        const results = await downloadResults(tracks);

        console.log('adw', results)

        const {
            title, artists,
        } = tracks[0];

        console.log('awdwwd', title, artists)

        return await ctx.telegram.sendDocument(ctx.from.id,
            {source: results[0], caption: `${title} by ${artists[0].name}`, filename: `${title}.mp3`});

    })

    const DOWNLOADER_MSG = 'To download from Youtube, Instagram, TikTok, Twitter, Facebook, Pinterest and Soundcloud, just enter the link of the content you want to download!';

    // DESC HEARS
    bot.hears('Downloader', async (ctx) => {

        await ctx.reply(DOWNLOADER_MSG);

    });

    bot.start(async (ctx) => {

        await mySql.connect();

        let findUser = await mySql.select('users', `userid = ${ctx.message.chat.id}`);

        if(false/*!findUser.length*/) {

            await mySql.insert('users', [
                'userid', 'username',	'name'
            ], [
                String(ctx.message.chat.id),
                ctx.message.chat.username,
                ctx.message.chat.first_name
            ]);

        }

        await ctx.reply(
            "<b>Welcome to FunTech Bot!</b>\n We have a lot of tools and we are going to add a lot of other tools! To start, you can see the list of commands and their descriptions with the /help command, or use the menus below.\n<b>Please subscribe to <a href=\"https://t.me/+qGGw48DBe000NDc0\">our channel: FunTech</a> to get the latest news and features, PRO features, promotions, etc</b>"
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