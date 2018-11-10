/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

module.exports = {addLevelDBData, getLevelDBData, addDataToLevelDB, getAllData, lastRegister}

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  return db.get(key);
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i+' created.');
          addLevelDBData(i, value);
        });
}


// get all data
function getAllData() {
  list = [];
  let promisse =  new Promise((resolve, reject) => {
      db.createReadStream().on('data', function(data) {
        list.push(JSON.parse(data.value));
      }).on('error', function(err) {
          return console.log('Unable to read data stream!', err)
      }).on('close', function() {
        console.log('List: ' + list);
        resolve(list);
      });
    });
  return promisse;
}

// get last register on database
function lastRegister(){
  let count = 0;
   return new Promise((resolve, reject) => {
     db.createReadStream()
    .on('data', function(data) {
      count++;
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on('end', function () {
      resolve(getLevelDBData(count-1));
    });
  });
}