pragma solidity ^0.4.18;

import './base/Level.sol';
import './Lottery.sol';

contract LotteryFactory {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Lottery();
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    _player;
    Lottery instance = Lottery(_instance);
    //TODO: RNG
    return instance.jackpot(125);
  }
}
