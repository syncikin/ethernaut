// These are required to enable ES6 on tets
// and it's dependencies.
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');
const constants = require('./src/constants')
require('dotenv').config();

module.exports = {
  migrations_directory: "./migrations",
  networks: {

    ropsten: {
      host: process.env.ROPSTEN_HOST,
      port: 8565, /* 8555 parity, 8565 geth */
      network_id: constants.NETWORKS.ROPSTEN.id,
      gas: 3000000,
      gasPrice: 100000000000,
      from: constants.ADDRESSES[constants.NETWORKS.ROPSTEN.name]
    },

    development: {
      host: "localhost",
      port: 8545,
      network_id: constants.NETWORKS.DEV.id,
      from: constants.ADDRESSES[constants.NETWORKS.DEV.name]
    },

    /* NOTE: last entry is the default one */
  }
};
