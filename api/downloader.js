const {REG, fetchData, API_HOST, formatBytes, setSession} = require("../utils");

class Downloader {

    ctx;
    match;

    constructor(ctx) {

        this.ctx = ctx;
        this.match = ctx.match[1];

    }

    async youtube() {

        const data = await fetchData(`${API_HOST}/video-meta`, {
            id: this.match,
        });

        setSession(this.ctx, 'youtube', this.match, 'downloader');

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
            console.log('vv', v)
            dataArray.push([{
                text: `🎬 ${v.qualityLabel} - ${
                    formatBytes(Number(v.contentLength))
                } (${v.container})`,
                callback_data: `download_youtube_${v.itag}`,
            }]);
        });

        audios.forEach(au => {
            dataArray.push([{
                text: `🎶 ${au.audioBitrate}k - ${
                    formatBytes(Number(au.contentLength))
                } (${au.container})`,
                callback_data: `download_youtube_${au.itag}`,
            }]);
        });

        await this.ctx.replyWithPhoto({url: thumb},
            {
                reply_to_message_id: this.ctx.message.message_id,
                reply_markup: {
                    inline_keyboard: dataArray,
                }, caption, parse_mode: 'HTML'
            }
        );

    }

}

module.exports = Downloader;