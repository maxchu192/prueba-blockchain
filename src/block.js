const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

function Block (data) {
    this.hash = null;
    this.height = 0;
    this.body = Buffer.from(JSON.stringify(data).toString('hex'));
    this.time = 0;
    this.previousBlockHash = '';
}

Block.prototype.validate = function () {
    const self = this;
    return new Promise((resolve, reject)=>{
        let currentHash = self.hash;
        self.hash = SHA256(JSON.stringify({ ...self, hash: null})).toString();

        if (currentHash !== self.hash) {
            return resolve(false);
        }
        resolve(true);
    })
}

Block.prototype.getBlockData = function () {
    const self = this;
    return new Promise((resolve, reject)=>{
        let encodedData = self.body;
        let decodedData = hex2ascii(encodedData);
        let dataObject = JSON.parse(decodedData);

        if (dataObject === 'Genesis Block') {
            reject(new Error('This is Genesis Block'))
        };
        resolve(dataObject);
    })
}

Block.prototype.toString = function () {
    const {hash, height, body, time, previousBlockHash} = this;
    return `Block - 
    hash: ${hash}
    height: ${height}
    body: ${body}
    time: ${time}
    previousBlockHash: ${previousBlockHash}
    --------------------------------------`
}

module.exports = {
    Block,
}