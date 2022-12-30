const {getSession} = require("../utils");
const {Input} = require('telegraf');

async function downloadFromYoutube(ctx) {

    console.log('CTX222', getSession(ctx, 'downloader'), ctx.session)

    const yt = ctx.session.youtube;

    if (yt) {

        if (yt.hasVideo) {

            return await ctx.sendVideo(
                yt.url,
                {
                    // reply_to_message_id: ctx.from.id,
                    duration: yt.lengthSeconds,
                    caption: yt.title,
                    width: yt.width,
                    height: yt.height
                });

        } else {

            return await ctx.sendVoice(
                yt.url,
                {
                    // reply_to_message_id: ctx.from.id,
                    duration: yt.lengthSeconds,
                    caption: yt.title,
                });

        }

    }

    return await ctx.reply('OK!');

}

module.exports = {

    downloadFromYoutube,

}