# The Ethernaut

(WIP)
<p>The ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a> and in the comic <a href="https://en.wikipedia.org/wiki/The_Eternaut" target="_blank" rel="noopener noreferred">El Eternauta</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

### Running locally (development)

0. `git clone ...` and `npm install` as usual.
1. Start deterministic testrpc with `npm run rpc` (to stop `npm run killrpc`).
2. You might want to import one of the private keys in scripts/rpc.sh to your Metamask wallet.
3. Deploy contracts with `truffle migrate`.
4. Start react client with `npm start`.
5. To run solidity tests `truffle test`.

### Level development

1. Develop level contract in contracts/levels. Levels must extend contracts/base/Level.sol for basic game compatibility. Levels emit instances whose state can be modified by players, and check such state to determine if the player has completed the level.
2. Be nice and add a test xD
3. Add an entry to levels/levels.json for the level. This will be used by the migration scripts to automatically deploy and upload the contract to Ethernaut.sol.
4. Create and edit levels/descriptions/xxx.md and xxx_complete.md (shown when level is completed).

### Deployment

1. Modify src/constants.js' ACTIVE_NETWORK variable to the desired network, eg. 'NETWORKS.ROPSTEN' (set env variable ROPSTEN_HOST)
2. Run `truffle migrate --reset --network ropsten` (we're not supporting incremental builds right now)
3. Run `npm run deploy-client`
