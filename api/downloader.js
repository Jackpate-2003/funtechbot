const {REG, fetchData, API_HOST, formatBytes, setSession, bytesToMegaBytes} = require("../utils");
const {metaData} = require("../utils/yt");

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

    videos.forEach(v => {

        if (bytesToMegaBytes(v.contentLength || 0) < 50) {

            ctx.session = {
                ...ctx.session,
                youtube: {
                    url: v.url,
                    hasVideo: v.hasVideo,
                    lengthSeconds,
                    title: title,
                    width: v.width,
                    height: v.height,
                },
            }

            dataArray.push([{
                text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
                callback_data: `download_youtube`,
            }]);

        } else {

            dataArray.push([{
                text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
                url: v.url,
            }]);

        }

    });

    audios.forEach(au => {

        if (bytesToMegaBytes(au.contentLength || 0) < 50) {

            ctx.session = {
                ...ctx.session,
                youtube: {
                    url: au.url,
                    hasVideo: au.hasVideo,
                    lengthSeconds,
                    title: title,
                },
            }

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                callback_data: `download_youtube`,
            }]);

        } else {

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                url: au.url,
            }]);

        }

    });

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