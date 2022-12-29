const {getSession} = require("../utils");

async function downloadFromYoutube(ctx) {

    console.log('CTX222', getSession(ctx, 'downloader'), ctx.session)

    return await ctx.reply('OK!');

}

module.exports = {

    downloadFromYoutube,

}