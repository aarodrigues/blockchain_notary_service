# Blockchain Notary Service

Notary service blockchain using nodejs and hapijs framework.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project was build on linux operational system using NodeJS, but once this package was installed it should work fine and all systems.

### Installing

To running the project is necessary to install node.js, npm and the follows packages hapiJS, LevelDB and CryptoJS.

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

Create a block with data payload and add to the blockchain using a key "body". The block can be created send a request to url http://localhost:8000/block.  
It should return the following response after create a new block:

```json
{
    "hash": "e3f020e2cda598fc6f8635f6c4261e244fa819dbc21c783432e3ba09853382ee",
    "height": 1,
    "body": "Payload informed",
    "time": "1540262814",
    "previousBlockHash": "50a010fcdb3eb08056565191c0306b076ecd8818d6bf584344369bb1c30e79a4"
}
```

### GET 

Get a block from the chain based on blockchain height. The block can be retrieved send a request to url http://localhost:8000/block/{height}, where height is the block height on the chain.  
It should return a json from database with a following format:  
( Response from http://localhost:8000/block/0 )

```json
{
    "hash": "50a010fcdb3eb08056565191c0306b076ecd8818d6bf584344369bb1c30e79a4",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1540262777",
    "previousBlockHash": ""
}
```


## Built With

* [node.js](https://nodejs.org/en/) - JavaScript runtime    
* [hapi.js](https://hapijs.com/) - Javascript framework to build applications and services
* [npm](https://www.npmjs.com/) - Node Package Manager
* [leveldb](http://leveldb.org/) - Library for persistence

## Authors

* **Alano Acioli** - *Initial work* - [Blockchain Web API](https://github.com/aarodrigues/blockchain_web_api)

## Acknowledgments

* Blockchain Nanodregree Udacity course

