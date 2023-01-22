const fetch = require('node-fetch');
const Mysql = require("../db/mysql");
const {replyOptions} = require("../utils/bot");
const {Input} = require('telegraf');

const REG = {

    youtube: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    soundcloud: /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/,
    instagram: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
    tiktok: /\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video|music)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/gm,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?/,
    twitter: /^https?:\/\/(www.|m.|mobile.)?twitter\.com\/(?:#!\/)?\w+\/status?\/\d+/,
    pinterest: /^https?:\/\/(www\.)?(pinterest|pin)\.(com|it)/,
    appleMusic: /^https?:\/\/(www\.)?music.apple\.com/,
    spotify: /^https?:\/\/(www\.)?open.spotify\.com/,

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

async function waitForSent(ctx, workFunc) {

    const sendWaitMsg = await ctx.reply('Processing...',
        {
            ...replyOptions,
            reply_to_message_id: ctx.message.message_id,
        }
    );

    const mySql = new Mysql();

    await mySql.connect();

    await mySql.insert('reqs', [
        'cmd', 'userid', 'username', 'name'
    ], [
        ctx.message.text,
        Number(ctx.message.chat.id),
        ctx.message.chat.username,
        ctx.message.chat.first_name
    ]);

    const res = await workFunc(ctx);

    await ctx.telegram.deleteMessage(
        ctx.chat.id,
        sendWaitMsg.message_id
    );

    return res;

}

async function getUrlBuffers(url) {

    const req = await fetch(url);

    return Buffer.from(await req.arrayBuffer());

}

const HOST = 'https://smiling-crab-tunic.cyclic.app';
// const HOST = '67.219.139.52';

module.exports = {

    REG, API_HOST, fetchData, formatBytes, bytesToMegaBytes,
    getSession, setSession, auth, makeID, HOST, waitForSent,
    getUrlBuffers,
}