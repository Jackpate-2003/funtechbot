const {getSession, fetchData} = require("../utils");
const {Input} = require('telegraf');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');

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

module.exports = {

    downloadFromYoutube,

}