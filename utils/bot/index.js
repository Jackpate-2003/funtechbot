const {waitForSent} = require("../index");

const replyOptions = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            ["Downloader"],
            ["Download song with its name or lyrics"]
        ]
    }, parse_mode: 'HTML',
};

class Bot {

    bot;

    constructor(bot) {

        this.bot = bot;

    }

    async hear(msg, func, returnFunc) {

        this.bot(msg, async (ctx) => {

            const data = await waitForSent(ctx, func);

            return await returnFunc(data);

        });

    }

    static async reply(ctx, msg, options) {

        const opt = options | {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    ["Downloader"],
                    ["Download song with its name or lyrics"]
                ]
            }, parse_mode: 'HTML',
        };

        return await ctx.reply(msg, opt);

    }

}

module.exports = {
    replyOptions, Bot,
}