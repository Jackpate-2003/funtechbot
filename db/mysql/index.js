const mysql = require('mysql2');

class Mysql {

    pool;
    connection;

    constructor() {

        this.pool = mysql.createPool({
            connectionLimit: 100,
            waitForConnections: true,
            host: "containers-us-west-167.railway.app",
            port: 5907,
            user: "root",
            password: "u26UZOhuMp9I1iU2mliV",
            database: "railway",
        });

    }

    async connect() {

        this.connection = await new Promise((res, rej) => {

            this.pool.getConnection(function (err, connection) {

                if (err) {
                    console.log('DB connection error', err)
                    rej(err);
                }

                res(connection);

            });

        });

    }

    async insert(table, columns = [], values) {

        const sql =
            `INSERT INTO ${table} (${columns.join(', ')}) VALUES (?)`;

        await new Promise((res, rej) => {

            this.connection.query(sql, [values], function (err, result) {

                if (err) {
                    console.log('Insert error');
                    rej(err);
                }

                res(result);

            });

        });

        this.connection.release();

    }

    async select(table, where) {

        const sql = `SELECT *
                     FROM ${table} t
                     WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.connection.query(sql, function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

    async update(keyValue = [], where) {

        const sql = `UPDATE cfrin_33314261_funtekbot
                     SET ${keyValue.join(', ')}
                     WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.db.query(sql, function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

    async remove(where) {

        const sql = `DELETE
                     FROM cfrin_33314261_funtekbot
                     WHERE ${where}`;

        return await new Promise((res, rej) => {

            this.db.query(sql, function (err, result) {
                if (err) rej(err);

                res(result);

            });

        });

    }

}

module.exports = Mysql;