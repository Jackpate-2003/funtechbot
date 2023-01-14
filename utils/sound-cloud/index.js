const {getUrlBuffers} = require("../index");

async function soundCloudDownloader(url) {

    if (url.includes('?')) {

        url = url.substring(0, url.lastIndexOf('?'));

    }

    const SoundCloud = require("soundcloud-scraper");

    const client = new SoundCloud.Client();

    const song = await client.getSongInfo(url);

    const {
        title, duration, thumbnail, author,
    } = song;

    const stream = await song.downloadProgressive();

    return {
        stream,
        thumb: await getUrlBuffers(thumbnail),
        title,
        performer: author.name,
        duration: duration / 1000,
    }

}

module.exports = {
    soundCloudDownloader,
}