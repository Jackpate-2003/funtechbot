const {REG, fetchData, API_HOST, formatBytes, setSession, bytesToMegaBytes, makeID} = require("../utils");
const {metaData} = require("../utils/yt");
const S3 = require('../db/s3');
const {HOST} = require("../utils");

async function youtubeInfo(ctx) {

    const match = ctx.match[1];

    const {
        videos, audios, title, description, url, thumb,
        duration, lengthSeconds,
    } = await metaData(match);

    const caption = `
    <b>Link:</b> ${url}
    <b>Title:</b> ${title}
    <b>Duration:</b> ${duration}
    `;

    let dataArray = [];

    const s3 = new S3();

    for (let v of videos) {

        const key = makeID(6);

        global.sl[key] = v.url;

        dataArray.push([{
            text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                formatBytes(Number(v.contentLength))
            } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
            url: `${HOST}/red?id=${key}`,
        }]);

    }

    for (let au of audios) {

        const key = makeID(6);

        global.sl[key] = au.url;

        dataArray.push([{
            text: `🎶 ${au.audioBitrate}k - ${
                formatBytes(Number(au.contentLength))
            } (${au.container})`,
            url: `${HOST}/red?id=${key}`,
        }]);

        continue;

        if (bytesToMegaBytes(au.contentLength || 0) < 50) {

            setSession(ctx, 'youtube', {
                url: au.url,
                title,
                bitrate: Number(au.audioBitrate),
            });

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                callback_data: `download_youtube`,
            }]);

        } else {

            global.sl[key] = au.url;

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                url: `${HOST}/red?id=${key}`,
            }]);

        }

    }

    return await ctx.replyWithPhoto({url: thumb},
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: dataArray,
            }, caption, parse_mode: 'HTML'
        }
    );

}

module.exports = {
    youtubeInfo,
};