async function findTrack(trackID) {

    const ytMusic = await import('node-youtube-music/dist/index.mjs');

    return await ytMusic.searchMusics(trackID);

}

async function downloadResults(ids, tracksCount = 1) {

    const ytdl = require('ytdl-core');
    const fetch = require('node-fetch');
    const { Input } = require('telegraf');

    let resultArray = [];

    for (let i = 0; i < tracksCount; i++) {

        let chunks = [];

        const audio = ytdl(ids[i].id, {filter: 'audioonly', quality: 'highestaudio'});

        const imageFetch = await fetch(ids[i].thumb);

        const imageBuffer = Buffer.from(await imageFetch.arrayBuffer());

        resultArray.push({
            thumbStream: Input.fromBuffer(imageBuffer),
            musicStream: Input.fromBuffer(
                await new Promise((res, rej) => {
                    audio.on('data', chunk => {
                        chunks.push(chunk);
                    }).on('end', () => {
                        res(Buffer.concat(chunks));
                    })
                })
            )
        });

    }

    return resultArray;

}

module.exports = {
    findTrack, downloadResults,
}