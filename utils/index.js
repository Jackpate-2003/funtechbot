const fetch = require('node-fetch');
const Mysql = require("../db/mysql");
const {replyOptions} = require("../utils/bot");
const {Input} = require('telegraf');

const REG = {

    youtube: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    soundcloud: /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/,
    instagram: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
    tiktok: /\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/gm,
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

    const PROCESS_GIF = 'R0lGODlhZABkAPcAAP///y56pjN+qD+FrDqOsT+buEGGrUSIr0aLsEuNsk+QtUWQs1KStlWUuFmWuV2Zu1SZuWOdvUWhvWqhvz2cxUqXxUaXyUqbyFSfzU2f0GWfwUyhy1Six16hw1ykyleqylys0lqn0V6y1WWixGyjwm6oxWSnymmlyWWry2yqzGCqxHKmxHapxnmqx3Oqyn2tynKzz32wzWWq0Wuu1Gat2HKu0nmv0G201W2y226622a52HSz1H601Hy603K03HW723q52nS95He64EDO1EHQ1mjG33rB3WrH4H3D5HbG5YCvy4SyzIq1zoS104230IK81Yy504O83Iy/3pO70pi/1JK+2oa+4oi+4IPC24zC2YfA15bC15vB1pTC25vE3JHI3pvL3qLF2qbK3KvL3aDD17DO3bXR34bG4ovE4oXM7YnL6JPF5J3H4pXM4pzM45LL6Z3O7JTH6IXS7I3U7IzV65PU7JvW7pna7IzW9Y7V+obY9pTV85rV9pTa8p3a85HU+p3U+qDH4KXL46rO5abP6rPP4KTS463Q5aPT7a7R6aTa7a3c7LTR4bzW5LLT6rjX7LPe7rzb7bza5KfP9qXW9avX9aTa9Kza9KHW+q7b+KfV+bTb8rvd8rLe+pvm+bXh77rg76jl+L3i9LTi/Lvk/Lbo98LZ5sLc7Mne68Hf8s3i7Mfh7tLl7sXi88nl9cPt98zp9sXk+8rm+sTt+szr/tTr9N/r893r89vr8tTs/9nv/9bk8sbz+svy/Nzy/dnz+eDv8+Pv9OHu9OXt+Ofz9+Tw9OTx9uj09+X0/Ov3++j1+O33++v2+u/7++35++76+/D7+/H5+/H6/PH7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJMgAAACH/C3htcCBkYXRheG1w/z94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3Lncub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJmOmFib3V0PSIiIP94bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bW5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdFQzJGQzg2RjA3MTFFOUFEMDVDMkU0QTE4NUI0N0T/IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdFQzJGQzhENkYwNzExRUFEMDVDMkU0QTE4NUI0N0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieHAuaWlkOjdFQzJGQzhBNkYwNzExRTlBRDA1QzJFNEExODVCNDdEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdFQzJGQzhCNkYwNzExRTlBRDA1QzJFNEExODVCNDdEIi8+IDwvcmRmOkRzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBl/25kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3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';

    const sendWaitMsg = await ctx.replyWithAnimation(Input.fromBuffer(Buffer.from(PROCESS_GIF, 'base64')),
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