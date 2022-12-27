const {REG, fetchData, API_HOST, formatBytes} = require("../utils");

const platform = (ctx, text, match) => ({

    youtube: async () => {

        const data = await fetchData(`${API_HOST}/video-meta`, {
            id: match,
        });

        const {
            videos, audios, title, description, url, thumb,
            duration,
        } = await data.json();

        const caption = `
    <b>Link:</b> ${url}
    <b>Title:</b> ${title}
    <b>Duration:</b> ${duration}
    `;

        let dataArray = [];

        videos.forEach(v => {

            const cd = Buffer.from(`download_yt_${
                url
            }_${
                v.itag
            }`, 'utf8').toString('hex');

            dataArray.push([{
                text: `🎬 ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container})`,
                callback_data: cd,
            }]);
        });

        audios.forEach(au => {

            const cd = Buffer.from(`download_yt_${
                url
            }_${
                au.itag
            }`, 'utf8').toString('hex');

            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                callback_data: cd
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

    },

});

module.exports = async function (ctx, text) {

    let match;

    for (const rk in REG) {

        match = text.match(REG[rk]);

        if (match) {

            return await platform(ctx, text, match[1])[rk]();

        }

    }

}