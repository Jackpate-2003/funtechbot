const mysql = require('mysql');

class Mysql {

    db;

    constructor() {

        this.db = mysql.createConnection({
            host: "sql208.cfree.in",
            user: "cfrin_33314261",
            password: "3pH64yy1fP",
            database: "cfrin_33314261_funtekbot",
        });

    }

    async connect() {

        await new Promise((res, rej) => {

            this.db.connect(function (err) {

                if (err) rej(err);

                res(true);

            });

        });

    }

    async insert(table, columns = [], values) {

        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ?`;

        return await new Promise((res, rej) => {

            this.db.query(sql, [values], function (err, result) {

                if (err) rej(err);

                res(result);

            });

        });

    }

    async select(table, where) {

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