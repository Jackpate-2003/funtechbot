const {getSession, fetchData} = require("../utils");
const {Input} = require('telegraf');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');

async function downloadFromYoutube(ctx) {

    console.log('CTX222', getSession(ctx, 'downloader'), ctx.session)

    const yt = ctx.session.youtube;

    if (yt) {

        const file = await fetch(yt.url);

        let chunks = [];

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const buffer = new Promise((res, rej) => {
            ffmpeg(fileBuffer)
                .audioBitrate(yt.bitrate)
                .on('data', chunk => {

                    chunks.push(chunk);

                }).on('end', () => {

                res(Buffer.concat(chunks));

            });
        });

        ctx.sendVoice(buffer);

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

    return await ctx.reply('OK!');

}

module.exports = {

    downloadFromYoutube,

}