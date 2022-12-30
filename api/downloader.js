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

            dataArray.push([{
                text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
                url: 'https://example.com/efefefef',
            }]);

    });

    audios.forEach(au => {

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                url: 'https://example.com/efefefef',
            }]);

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