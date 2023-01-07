async function getMusicMetaData(url) {

    const SpottyDL = require('spottydl');

    return await SpottyDL.getTrack(url);

}

module.exports = {
    getMusicMetaData,
};