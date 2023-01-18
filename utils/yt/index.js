const {makeID, formatBytes, HOST, bytesToMegaBytes, setSession} = require("../../utils");
const {getSession} = require("../index");

const youtubeInfo = async (id) => {

    const ytdl = require('ytdl-core');
    const moment = require('moment');

    const info = await ytdl.getInfo(id);

    let videosWithAudio = [], videos = [], audios = [], thumb = '', duration = '';

    info.formats.forEach((f) => {

        if (f.hasVideo && f.hasAudio) {

            videosWithAudio.push(f);

        } else if (f.hasVideo) {
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

async function ytdlCallback(ctx) {

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

        let param = {
            text: `🎬${v.hasAudio ? '🎶' : ''} ${v.qualityLabel} - ${
                formatBytes(Number(v.contentLength))
            } (${v.container}) ● ${v.hasAudio ? 'with' : 'without'} audio`,
            callback_data: `download_yt ${ID} ${v.itag}`,

        };

        dataArray.push([param]);

    }

    for (let au of audios) {

        let param = {
            text: `🎶 ${au.audioBitrate}k - ${
                formatBytes(Number(au.contentLength))
            } (${au.container})`,
            callback_data: `download_yt ${ID} ${au.itag}`,
        }

        dataArray.push([param]);

    }

    return {
        thumb, dataArray, caption,
    };

}


async function youtubeDownloader(id, itag) {

    const ytdl = require('ytdl-core');

    const info = await ytdl.getInfo(id);

    let {
        title, thumbnails, lengthSeconds,
    } = info.videoDetails;

    const thumb = thumbnails[0].url;

    let res = {
        title, thumb, lengthSeconds,
    }

    const {hasVideo, hasAudio} = ytdl.chooseFormat(info.formats, {quality: itag});

    if (hasVideo) {

        const video = ytdl(id, {filter: 'videoonly', quality: itag});

        if (hasAudio) {

            res.stream = video;

            return res;

        }

        const audio = ytdl(id, {filter: 'audioonly', quality: 'highestaudio'});

        const ffmpeg = require('ffmpeg-static');
        const cp = require('child_process');

        const ffmpegProcess = cp.spawn(ffmpeg, [
            // Remove ffmpeg's console spamming
            '-loglevel', '0', '-hide_banner',
            // 3 second audio offset
            '-itsoffset', '3.0', '-i', 'pipe:3',
            '-i', 'pipe:4',
            // Rescale the video
            '-vf', 'scale=320:240',
            // Choose some fancy codes
            '-c:v', 'libx265', '-x265-params', 'log-level=0',
            '-c:a', 'flac',
            // Define output container
            '-f', 'matroska', 'pipe:5',
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5 */
                'pipe', 'pipe', 'pipe',
            ],
        });

        audio.pipe(ffmpegProcess.stdio[3]);
        video.pipe(ffmpegProcess.stdio[4]);

        res.stream = ffmpegProcess.stdio[5];

        return res;

    }

    const audio = ytdl(id, {filter: 'audioonly', quality: itag});

    res.stream = audio;

    return res;

}

module.exports = {
    youtubeInfo, youtubeDownloader, ytdlCallback,
}