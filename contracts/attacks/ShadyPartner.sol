pragma solidity ^0.4.0;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract ShadyPartner is Ownable {

  uint lastPayout;

  function payoutAndRegister(uint paymentTimestamp) external payable {
    require(msg.value > 0);
    lastPayout =  paymentTimestamp;

    // TODO: trigger assembly stop <HERE>
    /* Funds should have been received and a STOP would avoid the 2nd partner from receiving its funds */
  }

  function withdrawFunds() onlyOwner {
    msg.sender.transfer(this.balance);
  }
}
