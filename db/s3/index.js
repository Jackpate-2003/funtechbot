const AWS = require("aws-sdk");

class S3 {

    s3;
    BUCKET = process.env.BUCKET;

    constructor() {

        this.s3 = new AWS.S3();

    }

    async setObj(key, value) {

        await this.s3.putObject({
            Body: JSON.stringify(value),
            Bucket: this.BUCKET,
            Key: key,
        }).promise();

    }

    async getObj(key) {

        return await this.s3.getObject({
            Bucket: this.BUCKET,
            Key: key,
        }).promise();

    }

    async deleteObj(key) {

        await this.s3.deleteObject({
            Bucket: this.BUCKET,
            Key: key,
        }).promise();

    }

}

module.exports = S3;