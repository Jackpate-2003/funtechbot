async function twitterDownloader(url) {

    const twitterGetUrl = require("twitter-url-direct");

    if(url.includes('?')) {

        url = url.substring(0, url.indexOf('?'));

    }

    let {
        found, tweet_user, download,
    } = await twitterGetUrl(url);

    download = download.sort(((a, b) => (
        (Number(b.width) + Number(b.height)) - (Number(a.width) + Number(a.height))
    )));

    if(found) {

        return {
            user: tweet_user,
            download,
        };

    }

}

module.exports = {
    twitterDownloader,
}