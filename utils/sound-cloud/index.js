async function soundCloudDownloader(ctx) {

    let url = ctx.message.text;

    if (url.includes('?')) {

        url = url.substring(0, url.lastIndexOf('?'));

    }

    const SoundCloud = require("soundcloud-scraper");

    const client = new SoundCloud.Client();

    const song = await client.getSongInfo(url);

    const {
        title, description, thumbnail,
    } = song;

    const stream = await song.downloadProgressive();

    return await ctx.telegram.sendDocument(ctx.from.id,
        {
            source: stream,
            thumb: thumbnail,
            caption: description, filename: `${title}.mp3`
        });

}

module.exports = {
    soundCloudDownloader,
}