const {REG, fetchData, API_HOST, formatBytes, setSession, bytesToMegaBytes} = require("../utils");
const {metaData} = require("../utils/yt");

class Downloader {

    ctx;
    match;

    constructor(ctx) {

        this.ctx = ctx;
        this.match = ctx.match[1];

    }

    async youtube() {

        const data = await metaData(this.match);

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

            if (bytesToMegaBytes(v.contentLength) < 50) {

                setSession(this.ctx, 'youtube', v.url, 'downloader');

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

            if (bytesToMegaBytes(au.contentLength) < 50) {

                setSession(this.ctx, 'youtube', au.url, 'downloader');

                dataArray.push([{
                    text: `🎶 ${au.audioBitrate}k - ${
                        formatBytes(Number(au.contentLength))
                    } (${au.container})`,
                    callback_data: `download_youtube`,
                }]);

            }

            else {

                dataArray.push([{
                    text: `🎶 ${au.audioBitrate}k - ${
                        formatBytes(Number(au.contentLength))
                    } (${au.container})`,
                    url: au.url,
                }]);

            }

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