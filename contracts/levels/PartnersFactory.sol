pragma solidity ^0.4.18;

import './base/Level.sol';
import './Partners.sol';
import './Partner.sol';

contract PartnersFactory is Level {

  function createInstance(address _player) public payable returns (address) {

    require(msg.value >= 1 ether);

    Partner partner1 = new Partner();
    Partner partner2 = new Partner();
    partner1.transferOwnership(_player);
    Partners instance = (new Partners).value(msg.value)(partner1, partner2);

    return instance;
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    _player;
    Partners instance = Partners(_instance);

    // Partner 2 must not have received any funds
    if(instance.partner2().balance != 0) return false;

    // Instance must be drained out.
    if(instance.balance < 0.001 ether) return false;

    return true;
  }
}
