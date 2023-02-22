const fetch = require('node-fetch');
const {Input} = require('telegraf');

const replyOptions = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            ["Downloader"],
            ["Download song with its name or lyrics"]
        ]
    }, parse_mode: 'HTML',
};

const SUBSCRIBE_REPLY = `
<b>To use the bot, please subscribe to our channel</b>, to get access to the latest news, features, polls, criticism, requests to add tools, etc.
`, SUBSCRIBE_REPLY_OPTIONS = (ctx) => ({
    ...replyOptions,
    reply_to_message_id: ctx.message.message_id,
    reply_markup: {
        inline_keyboard: [
            [{
                text: 'Subscribe to the channel',
                url: 'https://t.me/funs_tech'
            }]
        ],
    },
});

const REG = {

    youtube: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    soundcloud: /^https?:\/\/(m\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
    instagram: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
    tiktok: /\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video|music)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/gm,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?/,
    twitter: /^https?:\/\/(www.|m.|mobile.)?twitter\.com\/(?:#!\/)?\w+\/status?\/\d+/,
    pinterest: /^https?:\/\/(www\.)?(pinterest|pin)\.(com|it)/,
    appleMusic: /^https?:\/\/(www\.)?music.apple\.com/,
    spotify: /^https?:\/\/(www\.)?open.spotify\.com/,
    url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,

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

function getSession(ctx, key, parent) {

    if (ctx.session) {

        if (parent && ctx.session[parent]) {
            return ctx.session[parent][key];
        }

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

async function isMember(bot, ctx, sendMsg = true) {

    try {

        const member = await bot.telegram.getChatMember('@funs_tech', ctx.message.chat.id);

        if (member.status === 'member' || member.status === 'creator') return member;

    } catch (err) {
    }

    if(sendMsg) await ctx.reply(SUBSCRIBE_REPLY, SUBSCRIBE_REPLY_OPTIONS(ctx));

}

async function waitForSent(bot, ctx, workFunc) {

    console.log('REQ', `${ctx.message.chat.id} - ${ctx.message.text}`);

    const member = await isMember(bot, ctx);

    if (!member) {

        return ctx;

    }

    const sendWaitMsg = await ctx.reply('Processing...',
        {
            ...replyOptions,
            reply_to_message_id: ctx.message.message_id,
        }
    );

    try {

        await workFunc(ctx);

        console.log(`OK REQ! ${ctx.message.chat.id}`);

    } catch (err) {

        console.log('ERROR', err);

        await ctx.reply('Process failed!');

        console.error(`ERR REQ ${ctx.message.chat.id}`);

    }

    await ctx.telegram.deleteMessage(
        ctx.chat.id,
        sendWaitMsg.message_id
    );

}

async function getUrlBuffers(url) {

    const req = await fetch(url);

    return Buffer.from(await req.arrayBuffer());

}

function getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        const iface = interfaces[devName];

        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}

const HOST = 'https://fun-tech.cyclic.app';
// const HOST = '67.219.139.52';
const baseUploadPath = 'uploads';

module.exports = {

    REG, API_HOST, fetchData, formatBytes, bytesToMegaBytes,
    getSession, setSession, auth, makeID, HOST, waitForSent,
    getUrlBuffers, baseUploadPath, replyOptions, getIPAddress,
    SUBSCRIBE_REPLY, SUBSCRIBE_REPLY_OPTIONS, isMember,
}
