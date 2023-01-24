async function downloader(url) {

    const ttDl = require("tiktok-video-downloader");

    const info = ttDl.getInfo(url);

    return {
        stream: info.url.no_wm,
        title: info.author.name,
        thumb: info.video.thumbnail,
        // duration: info.video.duration,
        // isVideo: true,
    }

}

module.exports = downloader;