const fs = require('fs');
const MySql = require('../db/mysql');

const db = new MySql();

async function isExists(path) {

    return await fs.promises.access(path, fs.constants.F_OK.then(() => true)
        .catch(() => false));

}

async function uploadReadableStream(readableStream, name, mime) {

    const PATH = `${baseUploadPath}/${name}.${mime}`;

    if (await isExists(PATH)) {
        return;
    }

    await db.insert('upload', ['name', 'mime'], [
        name, mime,
    ]);

    const writeStream = fs.createWriteStream(PATH);

    readableStream.pipe(writeStream);

    await new Promise((res, rej) => {

        writeStream.on('finish', res);

        writeStream.on('error', rej);

    });

    return PATH;

}

async function uploadFromUrl(url, name, mime) {

    const fetch = require("node-fetch");
    const stream = require("stream");

    const bufferStream = new stream.PassThrough();

    const req = await fetch(url);

    const buffer = Buffer.from(await req.arrayBuffer());

    bufferStream.end(buffer);

    await uploadReadableStream(bufferStream, name, mime);

}

async function remove2HoursFiles() {

    const selectUploads = await db.select('upload', 't.date < DATE_SUB(NOW(), INTERVAL 2 HOUR)');

    for (let up of selectUploads) {

        await new Promise((res, rej) => {

            fs.unlink(`${baseUploadPath}/${name}.${mime}`, function (err) {
                if (err) rej(err);
                else res(true);
            });

        });

    }

}

module.exports = {
    uploadFromUrl, uploadReadableStream,
    baseUploadPath, isExists, remove2HoursFiles,
}