const {getIPAddress} = require("../index");

async function downloader(url) {

    const tiktokDown = require('tiktok-down');

    const tt = new tiktokDown({
        clientIP: getIPAddress(),
    });

    let res;

    let info = await tt.getDetails({
        url,
        noWaterMark: true
    });

    console.log('NOW HWR!')

    if (info.video.playAddr.includes('http')) {

        res = {
            stream: info.video.playAddr,
            title: info.desc,
            duration: info.video.duration,
            isVideo: true,
        }

    } else {

        info = await tt.getDetailsMusic({
            url,
            noWaterMark: true
        });

        res = {
            stream: info.music.playUrl,
            title: info.music.title,
            artist: info.music.authorName,
            duration: info.music.duration,
        }

    }

    return res;

}

module.exports = downloader;