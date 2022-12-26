const platforms = (ctx, text) => ({

    yt: async () => {

        console.log('CTX', ctx, text)

        return ctx.reply('OK!', text);

    }

});

module.exports = async function (ctx, text) {

    const method = platforms(ctx, text)[text.split(' ')[0].replace('download_', '').trim()];

    if(
        method
    ) {

        return await method();

    }

}