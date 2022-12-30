const metaData = async (id) => {

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

module.exports = {
    metaData,
}