const YT_REG = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

function ytDl() {



}

module.exports = function (bot) {

    bot.command(YT_REG, async (ctx) => {

        const text = ctx.message.text;

        const caption = `
    <b>Link:</b> ${text}
    <b>Title:</b> Test!
    <b>Duration:</b> 00:02:00
    `;

        ctx.replyWithPhoto({url: 'http://i3.ytimg.com/vi/ON8Lifu0Vzw/hqdefault.jpg'},
            {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "test button", callback_data: "efef",
                        }]
                    ]
                }, caption, parse_mode: 'HTML'
            }
        );

        console.log('Message sent!');

    });

}