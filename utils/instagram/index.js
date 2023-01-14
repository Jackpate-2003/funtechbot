async function instagramDownloader(url) {

    url = url.replace('reels/videos', 'tv');

    url = url.replace('instagr.am', 'instagram.com');

    url = url.replace('instagr.com', 'instagram.com');

    const instagramGetUrl = require("instagram-url-direct");

    const {url_list} = await instagramGetUrl(url);

    return url_list;

}

module.exports = {
    instagramDownloader,
}