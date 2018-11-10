const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require('./simpleChain.js');

let blockchain;
let idTimestamp = new Map();
let timeout = 5000;

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
        this.postNewBlock();
        this.requestStarRegistration();
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
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    requestStarRegistration() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.body == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";
                let blockchainID = payload.body;

                let message = this.requestValidate(blockchainID);

                console.log(message);
                return message
            }
        });
    }

    requestValidate(id){
        let time = new Date().valueOf();
        let messageToSign;
        let time_left = 0;
        let stored_time = idTimestamp.get(id)
        console.log(idTimestamp.get(id));
        if(stored_time!= undefined){
            //verify timestamp
            time_left  = time - stored_time;
            if(time_left >= timeout){
                idTimestamp.delete(id);
                time_left = 0;
                return "Address removed. Please make a new request."
            }
        }else{
            idTimestamp.set(id,time);
        }

        let starRegistry = "starRegistry";
        messageToSign = id+":"+time+":"+starRegistry;
        return this.createJsonResponse(messageToSign,time,time_left);
    }

    createJsonResponse(message,time,time_left){
        let response = {
            message_details: message,
            request_timestamp: time,
            time_remaining: time_left
        };
        return JSON.stringify(response);
    }


    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.body == "") return "Erro, wasn't possible to create block.\n(Empty payload)";
                let block = new BlockClass.Block(payload.body);
                const newBlock = blockchain.addBlock(block);
                return newBlock;
            }
        });
    }

    /**
     * Initializes blockchain object
     */
    initBlockChain() {
        if(blockchain != "undefined")
            blockchain = new BlockChainClass.Blockchain();
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}