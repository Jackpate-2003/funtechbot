const REG = {

    youtube: /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/,


}

const API_HOST = 'https://fun-tech.vercel.app/api';

async function fetchData(url, body) {

    const fetch = require('node-fetch');

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

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

module.exports = {

    REG, API_HOST, fetchData, formatBytes,

}