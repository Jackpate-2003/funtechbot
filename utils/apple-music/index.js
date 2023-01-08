async function getMusicMetaData(url) {

    const {Headers} = require('node-fetch');
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');

    const headers = new Headers();

    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

    let request = await fetch(
        url, {
            method: "GET",
            headers: headers
        });

    let body = await request.text();

    let $ = cheerio.load(body);

    let title = $('meta[property="og:title"]');

    title = title[0].attribs.content;

    return title;

}

module.exports = {
    getMusicMetaData,
}