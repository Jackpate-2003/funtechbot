async function soundCloudDownloader(ctx) {

    const url = ctx.message.text;

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