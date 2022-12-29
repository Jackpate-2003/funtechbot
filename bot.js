const Downloader = require('./api/downloader');
const download = require('./api/download');
const {REG} = require("./utils");

async function ytd(ctx) {

    const ytdl = require('ytdl-core');
    const ffmpeg = require('ffmpeg-static');
    const cp = require('child_process');

    const id = 'ON8Lifu0Vzw',
        itag = 134;

    const info = await ytdl.getInfo(id);

    const details = info.videoDetails;

    let file;

    const format = ytdl.chooseFormat(info.formats, {quality: String(itag)});

    if (
        (format.hasVideo && format.hasAudio) ||
        (!format.hasVideo)
    ) {

        file = format.url;

    }

    if (!file) {

        const tracker = {
            start: Date.now(),
            audio: {downloaded: 0, total: Infinity},
            video: {downloaded: 0, total: Infinity},
        };

        const video = ytdl(id, {filter: 'videoonly', quality: String(itag)})
            .on('progress', (_, downloaded, total) => {
                tracker.video = {downloaded, total};
            });
        const audio = ytdl(id, {filter: 'audioonly', quality: 'highestaudio'})
            .on('progress', (_, downloaded, total) => {
                tracker.audio = {downloaded, total};
            });

        const ffmpegProcess = cp.spawn(ffmpeg, [
            // Remove ffmpeg's console spamming
            '-loglevel', '0', '-hide_banner',
            '-i', 'pipe:3',
            '-i', 'pipe:4',
            '-c:v', 'libx265', '-x265-params', 'log-level=0',
            '-c:a', 'flac',
            // Define output container
            '-f', 'matroska', 'pipe:5',
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5 */
                'pipe', 'pipe', 'pipe',
            ],
        });

        let chunks = [], fileSize = 0;

        audio.pipe(ffmpegProcess.stdio[3]);
        video.pipe(ffmpegProcess.stdio[4]);

        const buffers = await new Promise((res2, rej) => {
            ffmpegProcess.stdio[5].on('data', (chunk) => {
                chunks.push(chunk);
                fileSize += chunk.length;
            }).on('end', () => {

                res2(Buffer.concat(chunks));

            });
        });

        const {Input} = require('telegraf');

        await ctx.sendVideo(
            Input.fromBuffer(buffers)
            // ctx.from.id,
           /* {
                // reply_to_message_id: ctx.from.id,
                duration: Number(details.lengthSeconds),
                caption: details.title,
                width: format.width,
                height: format.height
            }*/);

    }

}

function start(bot) {

    bot.hears(REG.youtube, async (ctx) => {

        console.log('HEre!', ctx.match)

        const downloader = new Downloader(ctx);

        await downloader.youtube();

    });

    bot.hears('test', async (ctx) => {
        await ctx.reply(await ytd(ctx));
    });

    bot.action(/download_(.*)/, async (ctx) => {

        await download(ctx, ctx.match[0]);

    });

}

module.exports = {
    start,
}