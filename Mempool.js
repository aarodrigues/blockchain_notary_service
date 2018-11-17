const BitMsg = require('bitcoinjs-message');

const timeoutRequestsWindowTime = 5*60*1000;

class Mempool {
    constructor(){
        this.mempool = new Map();
        this.mempoolValid = new Map();
   }

   /**
    * Add a request to mempool
    * @param {*} address 
    */
   addRequestValidation(address){
       let time = this.mempool.get(address);
       let time_left;
        if(time == undefined){
            time = new Date().valueOf();
            time_left = timeoutRequestsWindowTime;
            this.mempool.set(address,time);
            setTimeout(()=>{ this.mempool.delete(address) }, timeoutRequestsWindowTime );
        }
        else{
            time_left = this.getTimeLeft(time);
        }
       return this.requestObject(address,time,time_left);
   }



   /**
    * Calculate request timeout
    * @param {*} time 
    */
   getTimeLeft(time){
        let time_passed = new Date().valueOf()-time;
        let time_left = timeoutRequestsWindowTime -time_passed;
        if(time_left <= 0){
            
            time_left = 0;
        }   
        return time_left;
   }

   /**
    * Create a object response
    * @param {*} address 
    * @param {*} time 
    * @param {*} time_left 
    */
   requestObject(address,time,time_left){
        let response = {
            walletAddress: address,
            requestTimeStamp: time,
            message: address+":"+time+":starRegistry",
            validationWindow: time_left
        };
        return response;
   }

   /**
    * Verify message validation
    * @param {*} wallet_address 
    * @param {*} signed_message 
    */
   validateRequestByWallet(wallet_address,signed_message){
        let timestamp = this.mempool.get(wallet_address);
        let message = wallet_address+":"+timestamp+":starRegistry";
        let is_valid = false;
        let time_left = this.getTimeLeft(timestamp);
        if(time_left > 0)
            is_valid =  BitMsg.verify(message,wallet_address,signed_message);
        return this.validRequest(wallet_address,message, time_left,is_valid);
   }

   /**
    * Create valid mempool object
    * @param {*} wallet_address 
    * @param {*} message 
    * @param {*} time_left 
    * @param {*} valid 
    */
   validRequest(wallet_address,message,time_left,valid){
        let response = {
            registerStar: valid,
            status: {
                address: wallet_address,
                requestTimeStamp: this.mempool.get(wallet_address),
                message: message,
                validationWindow: time_left,
                messageSignature: valid
            }
        };
        if(valid)
            this.mempoolValid.set(wallet_address,response);
        return response;
   }

   /**
    * Verify if the request validation exists and if it is valid. 
    * @param {*} wallet_address 
    */
   verifyAddressRequest(wallet_address){
        let time = this.mempool.get(wallet_address);
        let valid_request;
        if(time != undefined){
            valid_request = this.mempoolValid.get(wallet_address);
            if(valid_request != undefined)
                return true;
        }
        return false;
   }


}

module.exports.Mempool = Mempool;