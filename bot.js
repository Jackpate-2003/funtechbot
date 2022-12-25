module.exports = function (bot) {

    bot.command("text", async (ctx) => {

        let reply = "https://www.youtube.com/v/ON8Lifu0Vzw";

        const caption = `
    <b>Link:</b> ${reply}
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