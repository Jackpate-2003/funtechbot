const fetch = require('node-fetch');

const REG = {

    youtube: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    soundcloud: /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/,
    instagram: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
    tiktok: /\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/gm,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?/,
    twitter: /^https?:\/\/(www.|m.|mobile.)?twitter\.com\/(?:#!\/)?\w+\/status?\/\d+/,
    pinterest: /^https?:\/\/(www\.)?(pinterest|pin)\.(com|it)/,

}

const API_HOST = 'https://fun-tech.vercel.app/api';

async function fetchData(url, body) {

    const headers = {'Content-Type': 'application/json'};

    return await fetch(url, {
        headers,
        method: 'POST',
        body: JSON.stringify(body),
    });

}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

function bytesToMegaBytes(bytes) {
    return Number(bytes) / (1024 * 1024);
}

function getSession(ctx, key) {

    if (ctx.session) {
        return ctx.session[key];
    }

}

function setSession(ctx, key, value, parent) {

    if (!ctx.session) {
        ctx.session = {};
    }

    if (parent) {
        if (!ctx.session[parent]) {
            ctx.session[parent] = {};
        }
        console.log(';;;a', ctx.session[parent][key] = value)
        return ctx.session[parent][key] = value;
    }

    ctx.session[key] = value;

}

function auth(key) {

    const ADMIN_KEY = 'WflgsCd@#dca_(13+*^[]q';

    if (ADMIN_KEY === key) {

        return true;

    }

}

function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function waitForSent(ctx, workFunc) {

    const ANIMATED_LOADING_MSG = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'];

    const processingMsg = i => `Processing... ${i === null ? '' : ANIMATED_LOADING_MSG[i]}`;

    let index = 0, intervalID;

    const sendWaitMsg = await ctx.reply(processingMsg(null), {
        reply_to_message_id: ctx.message.message_id,
    });

    return await new Promise((res, rej) => {

        intervalID = setInterval(async () => {

            if (index >= ANIMATED_LOADING_MSG.length) index = 0;

            await ctx.telegram.editMessageText(
                ctx.chat.id,
                sendWaitMsg.message_id,
                undefined,
                processingMsg(index)
            );

            ++index;

        }, 400);

        workFunc(ctx).then(response => {

            ctx.telegram.deleteMessage(
                ctx.chat.id,
                sendWaitMsg.message_id
            ).then(() => {
                clearInterval(intervalID);
                res(response);
            });

        }).catch(err => {

            ctx.telegram.deleteMessage(
                ctx.chat.id,
                sendWaitMsg.message_id
            ).then(() => {
                clearInterval(intervalID);
                res(response);
            });

            rej(err);
        });

    });

}

const HOST = 'https://beige-seal-wear.cyclic.app';

module.exports = {

    REG, API_HOST, fetchData, formatBytes, bytesToMegaBytes,
    getSession, setSession, auth, makeID, HOST, waitForSent,
}