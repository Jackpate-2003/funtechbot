const fetch = require('node-fetch');

const REG = {

    youtube: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,


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
        return ctx.session[parent][key] = value;
    }

    ctx.session[key] = value;

}

module.exports = {

    REG, API_HOST, fetchData, formatBytes,
    getSession, setSession,
}