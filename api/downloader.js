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

        console.log('wad', {
            videos, audios, title, description, url, thumb,
            duration,
        })

        const caption = `
    <b>Link:</b> ${url}
    <b>Title:</b> ${title}
    <b>Duration:</b> ${duration}
    `;

        ctx.replyWithPhoto({url: thumb},
            {
                reply_markup: {
                    inline_keyboard: [
                        videos.map(v => {
                            return {
                                text: `🎬 ${v.qualityLabel} - ${
                                    formatBytes(Number(v.contentLength))
                                } (${v.container})`,
                                callback_data: `download_yt:${
                                    Buffer.from(`
                                    ${v.url},${v.mimeType},${v.itag}
                                    `).toString('base64')
                                }`,
                            }
                        }),
                        audios.map(au => {
                            return {
                                text: `🎶 ${au.audioBitrate}k - ${
                                    formatBytes(Number(au.contentLength))
                                } (${au.container})`,
                                callback_data: `download_yt:${
                                    Buffer.from(`
                                    ${au.url},${au.mimeType},${au.itag}
                                    `).toString('base64')
                                }`,
                            }
                        })
                    ]
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

            await platform(ctx, text, match[1])[rk]();

            break;

        }

    }

    if (match) return true;

}