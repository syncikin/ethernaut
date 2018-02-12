pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Lottery is Ownable {

   struct Entry {
    address addr;
    uint256 contribution;
    uint256 guess;
  }

  Entry[] entries;

  function Lottery() payable {
    owner = msg.sender;
  }

  function bet(uint256 _guess) payable {
    entries.push(Entry(msg.sender, msg.value, _guess));
  }

  function spin(uint256 _answer) public onlyOwner {
    for (uint index = 0; index < entries.length; index++) {
      if (entries[index].guess == _answer) {
        entries[index].addr.transfer(this.balance);
      }
    }
  }
}
