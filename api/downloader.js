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
            dataArray.push([{
                text: `🎬 ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container})`,
                callback_data: `download_yt:${
                    Buffer.from(`
                                    ${v.url},${v.mimeType},${v.itag}
                                    `).toString('base64')
                }`,
            }]);
        });

        audios.forEach(au => {
            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                callback_data: `download_yt:${
                    Buffer.from(`
                                    ${au.url},${au.mimeType},${au.itag}
                                    `).toString('base64')
                }`,
            }]);
        });

        return await ctx.replyWithPhoto({url: thumb},
            {
                reply_markup: {
                    inline_keyboard: [
                        ...dataArray
                    ],
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