# Blockchain Notary Service

Notary service blockchain using nodejs and hapijs framework.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project was build on linux operational system using NodeJS, but once this package was installed it should work fine and all systems.

### Installing

To running the project is necessary to install node.js, npm and the follows packages hapiJS, LevelDB, CryptoJS, Hex2ascii and Bitcoinjs-message listed on package.json.

#### Node.js

Install using apt-get (Ubuntu):

```bash
    $ sudo apt-get update
    $ sudo apt-get install nodejs
```
Install npm (Ubuntu):

```bash
    $ sudo apt-get install npm
```
Install using pacman (ArchLinux):

```bash
    $ sudo pacman -Sy nodejs
```
Install npm (ArchLinux):

```bash
    $ sudo pacman -Sy npm
```

Install on Windows:

Download binary from oficial page [here](https://nodejs.org/en/download/)


#### Install Dependencies

Once installed Node.js download the project and on root directory (blockchain_web_api) run the follow command.

```bash
npm install
```

This will install all the packages needed to run the application.

## Usage

Lauch application running:

```bash
node app.js
```

Use Curl or Postman to test the POST and GET methods.

### POST

Use some web services tool as postman or curl to make requests to application.

#### Request validation

Submit a post request to the follow url http://localhost:8000/requestValidation to initiate star registration by acquiring a message as response to sign. The request wait to receive by payload a wallet address whose payload key is address.
The request returns the follow information and will be valid for 5 min.

```json
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1541605128",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
    "validationWindow": 300
}
```
#### Validate Request

Submit a post request to the follow url http://localhost:8000/message-signature/validate to validate access to register a star. The user should sign the message sent as response from requestValidation url and submit through payload using address and signature names as keys.
The request returns the follow json:

```json
{
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1541605128",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
        "validationWindow": 1760,
        "messageSignature": true
    }
}
```

#### Add star to blockchain

Submit a post request to the follow address http://localhost:8000/block to add a star in the body field on a private blockchain.
The request returns a json with block description and the star data on body field as showed below.

```json
{
     "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
           "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
           "star": {
                "ra": "16h 29m 1.0s",
                "dec": "-26° 29' 24.9",
                "story": 
        "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
             }
       },
      "time": "1532296234",
       "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```


### GET 

#### Get block by hash

Get a block from the chain based on blockchain hash. The block can be retrieved send a request to url http://localhost:8000/star/hash:{hash}, where {hash} is the block hash.  
It returns a json from database in the following format: 

```json
{
     "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
           "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
           "star": {
                "ra": "16h 29m 1.0s",
                "dec": "-26° 29' 24.9",
                "story":"Found star using https://www.google.com/sky/",
                "storyDecoded": "Found star using https://www.google.com/sky/"
             }
       },
      "time": "1532296234",
       "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

#### Get block by wallet address

Get all blocks from the chain based on wallet address. The block list related to the same address can be retrieved send a request to url http://localhost:8000/star/address:{address}, where {address} is the block wallet address.  
It returns a json from database in the following format with the decoded story:

```json
{
     "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
           "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
           "star": {
                "ra": "16h 29m 1.0s",
                "dec": "-26° 29' 24.9",
                "story":"Found star using https://www.google.com/sky/",
                "storyDecoded": "Found star using https://www.google.com/sky/"
             }
       },
      "time": "1532296234",
       "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

#### Get block by height

Get a block from the chain based on blockchain height. The block can be retrieved send a request to url http://localhost:8000/star/height/{height}, where {height} is the block height.  
It returns a json from database in the following format: 

```json
{
     "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
           "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
           "star": {
                "ra": "16h 29m 1.0s",
                "dec": "-26° 29' 24.9",
                "story":"Found star using https://www.google.com/sky/",
                "storyDecoded": "Found star using https://www.google.com/sky/"
             }
       },
      "time": "1532296234",
       "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```


## Built With

* [node.js](https://nodejs.org/en/) - JavaScript runtime    
* [hapi.js](https://hapijs.com/) - Javascript framework to build applications and services
* [npm](https://www.npmjs.com/) - Node Package Manager
* [leveldb](http://leveldb.org/) - Library for persistence
* [crypto-js](https://www.npmjs.com/package/crypto-js) - JavaScript library of crypto standards.
* [bitcoinjs-message](https://www.npmjs.com/package/bitcoinjs-message) - JavaScript library to handle signature.
* [boom](https://www.npmjs.com/package/boom) - JavaScript HTTP-friendly error objects.

## Authors

* **Alano Acioli** - *Initial work* - [Blockchain Web API](https://github.com/aarodrigues/blockchain_web_api)

## Acknowledgments

* Blockchain Nanodregree Udacity course

