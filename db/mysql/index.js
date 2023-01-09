const mysql = require('mysql');

class Mysql {

    db;

    constructor() {

        this.db = mysql.createPool({
            connectionLimit : 100,
            host: "containers-us-west-167.railway.app",
            port: 5907,
            user: "root",
            password: "u26UZOhuMp9I1iU2mliV",
            database: "railway",
        });

    }

    async connect() {

        console.log('HCC!')

        await new Promise((res, rej) => {

            this.db.connect(function (err) {

                if (err) {
                    console.log('Errr', err)
                    rej(err);
                }

                res(true);

            });

        });

    }

    async insert(table, columns = [], values) {

        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ?`;

        console.log('waw', sql, values)

        return await new Promise((res, rej) => {

            this.db.query(sql, [values], function (err, result) {

                if (err) rej(err);

                res(result);

            });

        });

    }

    async select(table, where) {

        return;

        const sql = `SELECT * FROM ${table} WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.db.query(sql, [values], function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

    async update(keyValue = [], where) {

        const sql = `UPDATE cfrin_33314261_funtekbot SET ${keyValue.join(', ')}  WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.db.query(sql, function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

    async remove(where) {

        const sql = `DELETE FROM cfrin_33314261_funtekbot WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.db.query(sql, function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

}

module.exports = Mysql;