async function soundCloudDownloader(ctx) {

    let url = ctx.message.text;

    if (url.includes('?')) {

        url = url.substring(0, url.lastIndexOf('?'));

    }

    const SoundCloud = require("soundcloud-scraper");
    const {Input} = require('telegraf');
    const fetch = require('node-fetch');

    const client = new SoundCloud.Client();

    const song = await client.getSongInfo(url);

    const {
        title, duration, thumbnail, author,
    } = song;

    const stream = await song.downloadProgressive();

    const imageFetch = await fetch(thumbnail);

    const imageBuffer = Buffer.from(await imageFetch.arrayBuffer());

    return await ctx.replyWithAudio(Input.fromReadableStream(stream),
        {
            thumb: Input.fromBuffer(imageBuffer),
            title,
            performer: author.name,
            duration: duration / 1000,
        });

}

module.exports = {
    soundCloudDownloader,
}