const {getSession, fetchData} = require("../utils");
const {Input} = require('telegraf');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');
const scdl = require('soundcloud-downloader').default;
const moment = require('moment');

async function downloadFromYoutube(ctx) {

    console.log('CTX222', getSession(ctx, 'downloader'), ctx.session)

    if (ctx.session && ctx.session.youtube) {

        console.log('OK!!!!!')

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

module.exports = {

    downloadFromYoutube, downloadFromSoundcloud,

}