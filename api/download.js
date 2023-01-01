const {getSession, fetchData, makeID, formatBytes, HOST} = require("../utils");
const {Input} = require('telegraf');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');
const scdl = require('soundcloud-downloader').default;
const moment = require('moment');
const {getVideoNoWM} = require("../utils/tiktok");

async function downloadFromYoutube(ctx) {

    if (ctx.session && ctx.session.youtube) {

        const yt = ctx.session.youtube;

        const file = await fetch(yt.url);

        let chunks = [];

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        /*const buffer = await new Promise((res, rej) => {
            ffmpeg(fileBuffer)
                .audioBitrate(yt.bitrate)
                .on('data', chunk => {

                    chunks.push(chunk);

                }).on('end', () => {

                res(Buffer.concat(chunks));

            });
        });*/

        return await ctx.sendVoice(fileBuffer);

        /*if (yt.hasVideo) {

            return await ctx.sendVideo(
                yt.url,
                {
                    // reply_to_message_id: ctx.from.id,
                    duration: yt.lengthSeconds,
                    caption: yt.title,
                    width: yt.width,
                    height: yt.height
                });

        } else {

            return await ctx.sendVoice(
                yt.url,
                {
                    // reply_to_message_id: ctx.from.id,
                    duration: yt.lengthSeconds,
                    caption: yt.title,
                });

        }*/

    }

}

async function downloadFromSoundcloud(ctx) {

    const url = ctx.message.text;

    let {
        title, duration,
    } = await scdl.getInfo(url);

    duration = Number((Number(duration) / 1000) / 60);

    let chunks = [];

    if (duration <= 20) {

        const stream = await scdl.download(url);

        const buffer = await new Promise((res2, rej) => {
            stream.on('data', (chunk) => {

                chunks.push(chunk);

            }).on('end', () => {

                res2(Buffer.concat(chunks));

            });
        });

        return await ctx.telegram.sendDocument(ctx.from.id,
            {source: buffer, caption: title, filename: `${title}.mp3`});

    }

    return await ctx.reply('The music is more than 20 minutes!');

}

async function downloadFromInstagram(ctx) {

    let url = ctx.message.text;

    url = url.replace('reels/videos', 'tv');

    url = url.replace('instagr.am', 'instagram.com');

    url = url.replace('instagr.com', 'instagram.com');

    const instagramGetUrl = require("instagram-url-direct");

    const {url_list} = await instagramGetUrl(url);

    for (let ul of url_list) {

        await ctx.sendDocument(ul);

    }

    return ctx;

}

async function downloadFromTiktok(ctx) {

    let url = ctx.message.text, links = [];

    links = await getVideoNoWM(url);

    for (let lk of links) {

        await ctx.sendDocument(lk);

    }

    return ctx;

}

async function downloadFromFacebook(ctx) {

    let url = ctx.message.text;

    const fbDownloader = require("fb-downloader-scrapper");

    const {
        success, download,
    } = await fbDownloader(url);

    if (success) {

        let dataArray = [];

        for (let down of download) {

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
                reply_to_message_id: ctx.message.message_id,
                reply_markup: {
                    inline_keyboard: dataArray,
                },
            }
        );

    }

}

async function downloadFromTwitter(ctx) {

    let url = ctx.message.text;

    const twitterGetUrl = require("twitter-url-direct");

    if(url.includes('?')) {

        url = url.substring(0, url.indexOf('?'));

    }

    const {
        found, tweet_user, download,
    } = await twitterGetUrl(url);

    let dataArray = [];

    if(found) {

        for(let down of download) {

            const key = makeID(6);

            const {
                dimension, url,
            } = down;

            global.sl[key] = url;

            dataArray.push([{
                text: `🎬🎶 ${dimension}`,
                url: `${HOST}/red?id=${key}`,
            }]);

        }

    }

    return await ctx.reply(tweet_user.text,
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: dataArray,
            },
        }
    );

}

module.exports = {

    downloadFromYoutube, downloadFromSoundcloud,
    downloadFromInstagram, downloadFromTiktok,
    downloadFromFacebook, downloadFromTwitter,

}