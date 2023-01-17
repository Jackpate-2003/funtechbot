const {makeID, formatBytes, HOST, bytesToMegaBytes, setSession} = require("../../utils");

const youtubeInfo = async (id) => {

    const ytdl = require('ytdl-core');
    const moment = require('moment');

    const info = await ytdl.getInfo(id);

    let videosWithAudio = [], videos = [], audios = [], thumb = '', duration = '';

    info.formats.forEach((f) => {

        if(f.hasVideo && f.hasAudio) {

            videosWithAudio.push(f);

        }

        else if (f.hasVideo) {
            videos.push(f);
        } else {
            audios.push(f);
        }

    });

    videosWithAudio = videosWithAudio.sort((a, b) => (
        (b.width + b.height) - (a.width + a.height)
    ));

    videos = videos.sort((a, b) => (
        (b.width + b.height) - (a.width + a.height)
    ));

    audios = audios.sort((a, b) => (
        (b.audioBitrate) - (a.audioBitrate)
    ));

    let {
        title, description, video_url, thumbnails, lengthSeconds,
    } = info.videoDetails;

    lengthSeconds = Number(lengthSeconds);

    thumbnails = thumbnails.sort((a, b) => (
        (Number(b.width) + Number(b.height)) -
        (Number(a.width) + Number(a.height))
    ));

    thumb = thumbnails[0].url;

    duration = moment.utc(lengthSeconds * 1000).format('HH:mm:ss');

    return {
        videos: [
            ...videosWithAudio,
            ...videos
        ], audios, title, description, url: video_url,
        thumb, duration, lengthSeconds,
    };

}

async function youtubeDownloader(ctx) {

    const ID = ctx.match[1];

    const {
        videos, audios, title, description, url, thumb,
        duration, lengthSeconds,
    } = await youtubeInfo(ID);

    const caption = `
    <b>Link:</b> ${url}
    <b>Title:</b> ${title}
    <b>Duration:</b> ${duration}
    `;

    let dataArray = [];

    for (let v of videos) {

        const key = makeID(6);

        let param = {
            text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                formatBytes(Number(v.contentLength))
            } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
        };

        global.sl[key] = v.url;

        param.url = `${HOST}/red?id=${key}`;

        /*if(bytesToMegaBytes(au.contentLength || 0) < 50) {

            param.callback_data = `download_yt_v ${key}`;

        }

        else {

            param.url = `${HOST}/red?id=${key}`;

        }*/

        dataArray.push([param]);

    }

    for (let au of audios) {

        const key = makeID(6);

        global.sl[key] = au.url;

        let param = {
            text: `🎶 ${au.audioBitrate}k - ${
                formatBytes(Number(au.contentLength))
            } (${au.container})`,
        }

        if (bytesToMegaBytes(au.contentLength || 0) < 50) {

            setSession(ctx, 'yt', {
                url: au.url,
                video: false,
                thumb,
                title,
                lengthSeconds,
            }, 'downloader');

            param.callback_data = `download_yt`;

        } else {

            param.url = `${HOST}/red?id=${key}`;

        }

        dataArray.push([param]);

    }

    return {
        thumb, dataArray, caption,
    };

}

async function youtubeAction(ctx) {

    /*if (ctx.session && ctx.session.youtube) {

        const yt = ctx.session.youtube;

        const file = await fetch(yt.url);

        let chunks = [];

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        /!*const buffer = await new Promise((res, rej) => {
            ffmpeg(fileBuffer)
                .audioBitrate(yt.bitrate)
                .on('data', chunk => {

                    chunks.push(chunk);

                }).on('end', () => {

                res(Buffer.concat(chunks));

            });
        });*!/

        return await ctx.sendVoice(fileBuffer);

        /!*if (yt.hasVideo) {

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

        }*!/

    }
*/
}

module.exports = {
    youtubeInfo, youtubeDownloader,
}