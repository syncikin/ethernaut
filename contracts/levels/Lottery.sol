pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Lottery is Ownable {

   struct Entry {
    address addr;
    uint256 number;
  }

  Entry[] entries;
  uint8 public numParticipants;
  uint8 public winCount;

  function Lottery() payable {
    owner = msg.sender;
    numParticipants = 0;
  }

  function purchaseTicket(uint256 _guess) payable {
    if (msg.value == 0.01 ether && numParticipants < 10) {
      entries.push(Entry(msg.sender, _guess));
      numParticipants++;
    }
  }

  function jackpot(uint256 _winningNumber) public onlyOwner returns (bool) {
    // Check for winner
    for (uint8 index = 0; index < numParticipants; index++) {
      if (entries[index].number == _winningNumber) {
        // Winner found!
        entries[index].addr.transfer(this.balance);
        winCount++;
        return true;
      }
    }

    // No winner, reset 
    for (index = 0; index < numParticipants; index++) {
      entries[index].addr = address(0);
      entries[index].number = 0;
    }
    return false;
  }
}
