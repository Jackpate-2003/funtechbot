const fetch = require("node-fetch");
const {Headers} = require('node-fetch');

//adding useragent to avoid ip bans
const headers = new Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');
const headersWm = new Headers();
headersWm.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');


const getIdVideo = (url) => {
    const matching = url.includes("/video/")
    if (!matching) {
        throw new Error('URL is incorrect!');
    }
    const idVideo = url.substring(url.indexOf("/video/") + 7, url.length);
    return (idVideo.length > 19) ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo;
}

const getVideoNoWM = async (url) => {

    const idVideo = getIdVideo(url);

    const API_URL = `https://api19-core-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}&version_code=262&app_name=musical_ly&channel=App&device_id=null&os_version=14.4.2&device_platform=iphone&device_type=iPhone9`;

    const request = await fetch(API_URL, {
        method: "GET",
        headers: headers
    });
    const body = await request.text();

    try {

        const res = JSON.parse(body);

        const urlMedia = res.aweme_list[0].video.play_addr.url_list[0];

        return [urlMedia];

    } catch (err) {
        throw new Error('Failed to fetch!');
    }
}

const generateUrlProfile = (username) => {
    let baseUrl = "https://www.tiktok.com/";
    if (username.includes("@")) {
        baseUrl = `${baseUrl}${username}`;
    } else {
        baseUrl = `${baseUrl}@${username}`;
    }
    return baseUrl;
};

const getListVideoByUsername = async (baseUrl) => {

    const puppeteer = require("puppeteer");

    // const baseUrl = generateUrlProfile(username);

    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();

    page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
    );

    await page.goto(baseUrl);

    let listVideo = [];

    let loop = true;

    while (loop) {
        listVideo = await page.evaluate(() => {
            const listVideo = Array.from(document.querySelectorAll(".tiktok-yz6ijl-DivWrapper > a"));
            return listVideo.map(item => item.href);
        });

        let previousHeight = await page.evaluate("document.body.scrollHeight");

        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, {timeout: 10000})
            .catch(() => {
                loop = false;
            });

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await browser.close();

    return listVideo;

}

module.exports = {
    getVideoNoWM, getListVideoByUsername,
}