async function findTrack(trackID) {

    const ytMusic = await import('node-youtube-music/dist/index.mjs');

    return await ytMusic.searchMusics(trackID);

}

async function downloadResults(ids, tracksCount = 1) {

    const ffmpegStatic = require('ffmpeg-static');
    const ytdl = require('ytdl-core');
    const cp = require('child_process');

    let resultArray = [];

    for (let i = 0; i < tracksCount; i++) {

        let chunks = [];

        const audio = ytdl(ids[i], {filter: 'audioonly', quality: 'highestaudio'});

        const ffmpegProcess = cp.spawn(ffmpegStatic, [
            '-loglevel', '0', '-hide_banner',
            '-i', 'pipe:0',
            '-f', 'mp3',
            'pipe:1'
        ]);

        audio.pipe(ffmpegProcess.stdio[0]);

        resultArray.push(
            await new Promise((res, rej) => {
                ffmpegProcess.stdout.on('data', chunk => {
                    chunks.push(chunk);
                }).on('end', () => {
                    res(Buffer.concat(chunks));
                })
            })
        );

    }

    return resultArray;

}

module.exports = {
    findTrack, downloadResults,
}