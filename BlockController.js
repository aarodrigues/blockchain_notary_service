const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require('./simpleChain.js');
const BitMsg = require('bitcoinjs-message');
const DecodeHex = require('hex2ascii');
const MempoolClass = require('./Mempool.js');

let blockchain;
let mempool;
let idTimestamp = new Map();

const timeoutRequestsWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initBlockChain();
        this.getBlockByIndex();
        this.requestStarRegistration();
        this.validateUserSignature();
        this.addBlock();
        this.getBlockByHash();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    requestStarRegistration() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.body == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";
                let address = payload.body;

                return mempool.addRequestValidation(address);

                // let message = this.timeValidate(address,false);
                // return message
            }
        });
    }

    validateUserSignature() {
        this.server.route({
            method: 'POST',
            path: '/message-signature/validate',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.address == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";
                let wallet_address = payload.address;
                let signed_message = payload.signature;

                return mempool.validateRequestByWallet(wallet_address,signed_message);

                // let message = wallet_address+":"+idTimestamp.get(wallet_address)+":starRegistry";

                // let response = this.timeValidate(wallet_address,true);
                // let valid =  BitMsg.verify(message,wallet_address,message_signature);
                
            }
        });
    }
    
    /**
     * Configure star registration endpoint to add a new Block, url: "/api/block"
     */
    addBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.address == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";
                let star = this.decodeStarStory(this.encodeStarStory(payload));
                let block = new BlockClass.Block(star);
                const newBlock = blockchain.addBlock(block);
                return newBlock;
            }
        });
    }
    
    encodeStarStory(body){
        body.star.story = new Buffer(body.star.story).toString('hex');
        return body;
    }

    decodeStarStory(body){
        body.star["storyDecoded"] = DecodeHex(body.star.story);
        return body;
    }

    getBlockByHash() {
        this.server.route({
            method: 'GET',
            path: '/stars/hash:{index}',
            handler: async (request, h) => {
             const block = await  blockchain.getBlockByHash(encodeURIComponent(request.params.index))
                .then((value)=>{
                    value.body.star.story = DecodeHex(value.body.star.story);
                    return value;
                }).catch((err)=>{
                    console.log("Block not found.");
                });
             return block;
            }
        });
    }

    
    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (request, h) => {
             const block = await  blockchain.getBlock(encodeURIComponent(request.params.index))
                .then((value)=>{
                    return JSON.parse(value);
                })
             return block;
            }
        });
    }



    /**
     * Initializes blockchain object
     */
    initBlockChain() {
        if(blockchain != "undefined")
            blockchain = new BlockChainClass.Blockchain();

        //if(mempool != "undefined")
            mempool = new MempoolClass.Mempool();  
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}