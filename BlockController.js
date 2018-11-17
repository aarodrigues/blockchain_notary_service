const BlockClass = require('./Block.js');
const BlockChainClass = require('./simpleChain.js');
const DecodeHex = require('hex2ascii');
const MempoolClass = require('./Mempool.js');

let blockchain;
let mempool;

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
        this.requestStarRegistration();
        this.validateUserSignature();
        this.addBlock();
        this.getBlockByHash();
        this.getBlockByWalletAddress();
        this.getBlockByHeight();
    }

    /**
     * Request a star validation"
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
            }
        });
    }

    /**
     * Validate user signature
     */
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
            }
        });
    }
    
    /**
     * Add new block with a star on blockchain"
     */
    addBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.address == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";
                if(mempool.verifyAddressRequest(payload.address)){
                    payload.star["storyDecoded"] = payload.star.story;
                    payload.star.story = this.encodeStarStory(payload.star.story);
                    let block = new BlockClass.Block(payload);
                    const newBlock = blockchain.addBlock(block);
                    return newBlock;
                }
                return "Invalid address request!";
            }
        });
    }
    
    /**
     * Encode story
     * @param {*} body 
     */
    encodeStarStory(data){
        let encoded = new Buffer(data).toString('hex');
        return encoded;
    }

    /**
     * Decode story
     * @param {*} body 
     */
    decodeStarStory(data){
        let decoded = DecodeHex(data);
        return decoded;
    }

    /**
     * Get block by hash
     */
    getBlockByHash() {
        this.server.route({
            method: 'GET',
            path: '/stars/hash:{hash}',
            handler: async (request, h) => {
             const block = await  blockchain.getBlockByHash(encodeURIComponent(request.params.hash))
                .then((value)=>{
                    value.body.star.story = this.decodeStarStory(value.body.star.story);
                    return value;
                }).catch((err)=>{
                    console.log("Block not found.");
                });
             return block;
            }
        });
    }

    /**
     * Get blocks by wallet address
     */
    getBlockByWalletAddress() {
        this.server.route({
            method: 'GET',
            path: '/stars/address:{address}',
            handler: async (request, h) => {
             const block_list = await  blockchain.getBlockByWalletAddress(encodeURIComponent(request.params.address))
                .then((list)=>{
                    for(let i = 0; i < list.length; i++)
                        list[i].body.star.story = this.decodeStarStory(list[i].body.star.story);
                    return list;
                }).catch((err)=>{
                    console.log("Block not found.");
                });
             return block_list;
            }
        });
    }

    /**
     * Get block by height
     */
    getBlockByHeight() {
        this.server.route({
            method: 'GET',
            path: '/stars/block:{height}',
            handler: async (request, h) => {
                console.log("hahaha");
             const block = await  blockchain.getBlockByHeight(encodeURIComponent(request.params.height))
                .then((value)=>{
                    value.body.star.story = this.decodeStarStory(value.body.star.story);
                    return value;
                }).catch((err)=>{
                    console.log("Block not found.");
                });
             return block;
            }
        });
    }


    /**
     * Initializes blockchain and mempool object
     */
    initBlockChain() {
        if(blockchain != "undefined")
            blockchain = new BlockChainClass.Blockchain();
        
        mempool = new MempoolClass.Mempool();  
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}