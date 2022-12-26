const platforms = (ctx, text) => ({

    yt: async () => {

        console.log('CTX222', ctx, text)

        return ctx.reply('OK!', text);

    }

});

module.exports = async function (ctx, text) {

    const method = platforms(ctx, text)[text.split(' ')[1]];

    if(
        method
    ) {

        return await method();

    }

}