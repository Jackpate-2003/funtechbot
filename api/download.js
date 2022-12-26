const platforms = (ctx, text) => ({

    yt: async () => {

        console.log('CTX', ctx, text)

        return ctx.reply('OK!');

    }

});

module.exports = async function (ctx, text) {

    const method = platforms(ctx, text)[text.replace('download_', '')];

    if(
        method
    ) {

        return await method();

    }

}