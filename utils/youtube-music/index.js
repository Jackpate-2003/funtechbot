async function findTrack(trackID) {

    const ytMusic = await import('node-youtube-music/dist/index.mjs');

    return await ytMusic.searchMusics(trackID);

}

async function downloadResults(results, tracksCount = 1) {

    const ffmpegStatic = require('ffmpeg-static');
    const ytdl = require('ytdl-core');
    const cp = require('child_process');

    let resultArray = [];

    for (let i = 0; i < tracksCount; i++) {

        let chunks = [];

        console.log('wdw', results[i])

        const audio = ytdl(results[i].youtubeId, {filter: 'audioonly', quality: 'highestaudio'});

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
                    console.log('dd', chunk)
                    chunks.push(chunk);
                }).on('end', () => {
                    console.log('OK!!')
                    res(Buffer.concat(chunks));
                })
            })
        );

    }

    return resultArray;

}