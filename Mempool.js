

const timeoutRequestsWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;

class Mempool {
    constructor(){
        this.mempool = new Map();
        this.mempoolValid = new Map();
        // this.mempool = [];
        // this.timeoutRequests = [];
        // this.mempoolValid = [];
        // this.timeoutMempoolValid = [];
   }

   addRequestValidation(){

   }

   setTimeOut(){
    let time = new Date().valueOf();
    let time_left = 0;
    let stored_time = idTimestamp.get(id)
    console.log(idTimestamp.get(id));
    if(stored_time!= undefined){
        //verify timestamp
        time_left  = time - stored_time;
        if(time_left >= timeoutRequestsWindowTime){
            idTimestamp.delete(id);
            time_left = 0;
            return "Address removed. Please make a new request."
        }
    }else{
        idTimestamp.set(id,time);
    }

    let messageToSign = id+":"+time+":starRegistry";
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

   validateRequestByWallet(){

   }
}

module.exports.Mempool = Mempool;