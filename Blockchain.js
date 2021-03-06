  /* ===== SHA256 with Crypto-js ===============================
  |  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
  |  =========================================================*/

  const SHA256 = require('crypto-js/sha256');
  let levelSandbox = require('./LevelSandbox');

  /* ===== Block Class ==============================
  |  Class with a constructor for block 			     |
  |  ===============================================*/

  const BlockClass = require('./Block');

  /* ===== Blockchain Class ==========================
  |  Class with a constructor for new blockchain 		|
  |  ================================================*/

  class Blockchain{
    constructor(){
      this.chain = levelSandbox.getLevelDBData,
      this.chain(0)
      .then((value)=>{
        console.log('Blockchain loaded.');
      })
      .catch((err)=>{
        this.addBlock(new BlockClass.Block("First block in the chain - Genesis block"));
      });
    }

      // Add new block
      addBlock(newBlock){
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        //get blockchain height
        return this.getBlockHeight()
        .then((height) =>{
            // Block height
            newBlock.height =  height + 1;
            if(newBlock.height>0){
              //async fucntion to get previous block  
              return levelSandbox.getLevelDBData(newBlock.height-1).then((value)=>{
                // previous block hash
                newBlock.previousBlockHash = JSON.parse(value).hash;
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Save in leveldb
                levelSandbox.addDataToLevelDB(JSON.stringify(newBlock));
                // return the block just added
                return newBlock;
              });
            }else{
              // Block hash with SHA256 using newBlock and converting to a string
              newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
              // Save in leveldb
              levelSandbox.addDataToLevelDB(JSON.stringify(newBlock));
            }
          return newBlock;
        }).catch((err)=>{
            console.log(err);
        });
      }

      // Get block height
      getBlockHeight(){
        return levelSandbox.lastRegister()
        .then((data)=>{return JSON.parse(data).height})
        .catch((err)=>{
          if(err.message == "Key not found in database [-1]"){
            console.log("Empty Database. First block created.");
            return -1;
          }
          else
            console.log(err);
        });
      }

      // get block
      getBlock(blockHeight){
        return this.chain(blockHeight);
      }

      // get block
      getBlockByHash(hash){
        return levelSandbox.getBlockByHash(hash);
      }

      // get block by wallet address
      getBlockByWalletAddress(address){
        return levelSandbox.getBlockByWalletAddress(address);
      }

      // get block by height
      getBlockByHeight(height){
        return levelSandbox.getBlockByHeight(height);
      }

      // validate block
      validateBlock(blockHeight){
        return new Promise((resolve, reject) => {
          let print = false; 
          // get block object
          this.getBlock(blockHeight)
          .then((value)=>{
            let block = JSON.parse(value);
            // get block hash
            let blockHash = block.hash;
            // remove block hash to test block integrity
            block.hash = '';
            // generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
              // Compare
            if (blockHash===validBlockHash) {
              resolve(true);
            }else{
              console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
              reject(false);
            }
          })
          .catch((err)=>{
            if (err) return console.log('Not found!', err);
          });
        });
      }

    // Validate blockchain
      validateChain(){
        let errorLog = [];
        let promises = [];
        this.getBlockHeight()
        .then((height)=>{
          for (var i = 0; i <= height; i++) {
            
            promises.push(this.getBlock(i)
            .then((value)=>{
              return JSON.parse(value); 
            }).catch((err)=>{
              if (err) return console.log('first Not found!', err);
            }));
          }
          // Interacting through all promises
          Promise.all(promises)
          .then((array)=>{
            for(i = 0; i<array.length-1; i++){

              this.validateBlock(array[i].height).then((valid)=>{
                if (!valid) errorLog.push(i);
              });
               let blockHash = array[i].hash;
               let previousHash = array[i+1].previousBlockHash;
               if (blockHash!==previousHash) {
                 errorLog.push(i);
               }
            }

            if (errorLog.length>0) {
              console.log('Block errors = ' + errorLog.length);
              console.log('Blocks: '+errorLog);
            } else {
              console.log('No errors detected');
            }
          }).catch((err)=>{
            console.log("Error: "+err);
          });

        }).catch((err)=>{
          console.log(err);
        });
      }
  }

  module.exports.Blockchain = Blockchain;