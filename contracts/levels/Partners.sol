pragma solidity ^0.4.18;

import './Partner.sol';

contract Partners {

  Partner public partner1;
  Partner public partner2;

  bool private reentrancyLock;

  function Partners(Partner _partner1, Partner _partner2) public payable {
    partner1 = _partner1;
    partner2 = _partner2;
  }

  function withdraw() public nonReentrant {
    uint256 val = this.balance / 2;
    partner1.payoutAndRegister.value(val)(now);
    partner2.payoutAndRegister.value(val)(now);
  }

  function updatePartnership(Partner _newPartner) {
    if(msg.sender == partner1.owner()) partner1 = _newPartner;
    else if(msg.sender == partner2.owner()) partner2 = _newPartner;
  }

  modifier nonReentrant() {
    require(!reentrancyLock);
    reentrancyLock = true;
    _;
    reentrancyLock = false;
  }

  function() public payable {}
}

/*

   ***     ***
 **   ** **   **
*       *       *
*               *
 *     BFF!    *
  **         **
    **     **
      ** **
        *
*/
