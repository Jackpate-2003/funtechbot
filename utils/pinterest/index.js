const {Headers} = require('node-fetch');
const fetch = require("node-fetch");
const cheerio = require('cheerio');

async function downloadPin(ctx) {

    const url = ctx.message.text;

    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

    let request = await fetch(
        url, {
            method: "GET",
            headers: headers
        });

    let body = await request.text();

    let $ = cheerio.load(body);

    let PWSData = JSON.parse(
        $('script[id="__PWS_DATA__"]').html()
    );

    let pinID = PWSData.props.context.current_url;

    pinID = pinID.substring(
        pinID.indexOf('pin')
    );
    pinID = pinID.split('/')[2];

    pinID = String(pinID);

    if (url.includes('pin.it')) {

        request = await fetch(
            'https://www.pinterest.com/pin/' + pinID, {
                method: "GET",
                headers: headers
            });

        body = await request.text();

        $ = cheerio.load(body);

        PWSData = JSON.parse(
            $('script[id="__PWS_DATA__"]').html()
        );

    }

    let videos = PWSData.props.initialReduxState.pins[pinID].videos, video, image;

    if (!videos) {

        const storyPin = PWSData.props.initialReduxState.pins[pinID].story_pin_data;

        if (storyPin && storyPin.pages) {

            videos = storyPin.pages[0].blocks[0].video;

        }

    }

    if (videos) {

        for (let vk in videos.video_list) {

            if (videos.video_list[vk].url.endsWith('.mp4')) {

                video = videos.video_list[vk].url;
                break;

            }

        }

    } else {

        const images = PWSData.props.initialReduxState.pins[pinID].images;

        for (let ik in images) {

            if (ik === 'orig') {

                image = images[ik].url;

                break;

            }

        }

    }

    if (video) {

        return await ctx.replyWithVideo(video);

    }

    return await ctx.replyWithPhoto(image);

}

module.exports = {
    downloadPin,
}