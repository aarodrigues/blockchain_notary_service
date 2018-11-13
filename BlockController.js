const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require('./simpleChain.js');
const BitMsg = require('bitcoinjs-message');

let blockchain;
let idTimestamp = new Map();
let timeout = 800000;

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
        this.starRegistration();
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

                let message = this.timeValidate(blockchainID,false);
                return message
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
                let message_signature = payload.signature;

                let message = wallet_address+":"+idTimestamp.get(wallet_address)+":starRegistry";

                let response = this.timeValidate(wallet_address,true);
                let valid =  BitMsg.verify(message,wallet_address,message_signature);
                return this.signedResponse(response,valid);

            }
        });
    }

    timeValidate(id,signed){
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

        messageToSign = id+":"+time+":starRegistry";
        return this.createJsonResponse(id,messageToSign,time_left,signed);
    }

    createJsonResponse(id,message,time_left,signed){
        let response = {
            address: id,
            requestTimeStamp: idTimestamp.get(id),
            message: message,
            validationWindow: time_left
        };
        if(signed){
            response["messageSignature"] = "valid";
            return response;
        }
        return JSON.stringify(response);
    }

    signedResponse(response,valid){
        valid ? response.messageSignature = "valid" : response.messageSignature = "invalid";
        let signed_response = {
            registerStar: valid,
            status: response
        }
        return JSON.stringify(signed_response);
    }

    /**
     * Configure star registration endpoint to add a new Block, url: "/api/block"
     */
    starRegistration() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {
                const payload = request.payload
                if(payload.address == "") return "Erro, wasn't possible register a empty ID.\n(Empty payload)";

                let block = new BlockClass.Block(payload);
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