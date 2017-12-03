pragma solidity ^0.4.0;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Partner is Ownable {

  uint lastPayout;

  function payoutAndRegister(uint paymentTimestamp) external payable {
    require(msg.value > 0);
    lastPayout =  paymentTimestamp;
  }

  function withdrawFunds() onlyOwner {
    msg.sender.transfer(this.balance);
  }
}
