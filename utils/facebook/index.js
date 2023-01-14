async function facebookDownloader(url) {

    const fbDownloader = require("fb-downloader-scrapper");

    const {
        success, download,
    } = await fbDownloader(url);

    if (success) {

        return download;

    }

}

module.exports = {
    facebookDownloader,
}