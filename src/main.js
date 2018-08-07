const SHA256 = require("crypto-js/sha256");
var datetime = new Date();

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
saveChain.addBlock(new Block(1, datetime, "Willy", "1234567896"));
saveChain.addBlock(new Block(2, datetime, "Alex", "1234567896"));
saveChain.addBlock(new Block(3, datetime, "Alejandra", "1234567896"));


console.log('Blockchain valid? ' + saveChain.isChainValid());

console.log('Changing a block...');
//saveChain.chain[1].name = "sdf";
// saveChain.chain[1].hash = saveChain.chain[1].calculateHash();

console.log("Blockchain valid? " + saveChain.isChainValid());

 console.log(JSON.stringify(saveChain, null, 4));
