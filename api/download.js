const {getSession} = require("../utils");
const platforms = (ctx, text) => ({

    youtube: async () => {

        console.log('CTX222', getSession(ctx, 'downloader'), text)

        return ctx.reply('OK!', text);

    }

});

module.exports = async function (ctx, text) {

    const method = platforms(ctx, text)[text.split('_')[1]];

    if(
        method
    ) {

        return await method();

    }

}