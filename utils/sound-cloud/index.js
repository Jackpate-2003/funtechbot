async function soundCloudDownloader(ctx) {

    const url = ctx.message.text;

    const SoundCloud = require("soundcloud-scraper");

    const client = new SoundCloud.Client();

    const song = await client.getSongInfo(url);

    const {
        title, description, thumbnail,
    } = song;

    const stream = await song.downloadProgressive();

    let chunks = [];

    const buffer = await new Promise((res, rej) => {

        stream.on('data', chunk => {
            chunks.push(chunk);
        }).on('end', () => {
            res(Buffer.concat(chunks));
        })

    });

    return await ctx.telegram.sendDocument(ctx.from.id,
        {
            source: buffer,
            thumb: thumbnail,
            caption: description, filename: `${title}.mp3`
        });

}

module.exports = {
    soundCloudDownloader,
}