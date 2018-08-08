const SHA256 = require("crypto-js/sha256");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

let upload = multer();

const app = express();
var datetime = new Date();

app.use(bodyParser.urlencoded({
        extended: false
}));
app.use(bodyParser.json());

const nodeAddr = 'JavaSampleApproach';

class Block {
    constructor(index, timestamp, name, dui, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.name = name;
        this.dui = dui;
        //this.data = data;
        this.hash = this.calculateHash();
    }

    calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + this.name + this.dui).toString();
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let saveChain = new Blockchain();
//saveChain.addBlock(new Block(1, "20/07/2017", "Alex", "12345678", { amount: 4 }));
/*saveChain.addBlock(new Block(1, datetime, "Willy", "1234567896"));
saveChain.addBlock(new Block(2, datetime, "Alex", "1234567896"));
saveChain.addBlock(new Block(3, datetime, "Alejandra", "1234567896"));*/

console.log('Blockchain valid? ' + saveChain.isChainValid());

console.log('Changing a block...');

app.post('/transaction', upload.fields([]), function (req, res) {
   /* const blockIndex = bitcoin.makeNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );*/

    req.setEncoding('utf8');
    saveChain.addBlock(new Block(
        4, 
        datetime, 
        req.body.name, 
        req.body.DUI
        )
    );

    let formData = req.body;
    console.log('form data', formData);

    
    const blockIndex = JSON.stringify(saveChain, null, 5);
    res.json(
        {
            message: `Transaction is added to block with index: ${blockIndex}`
        }
    );
});


//saveChain.chain[1].name = "sdf";
// saveChain.chain[1].hash = saveChain.chain[1].calculateHash();

//console.log("Blockchain valid? " + saveChain.isChainValid());

 console.log(JSON.stringify(saveChain, null, 4));

app.listen(3000, function () {
    console.log('> listening on port 3000...');
});