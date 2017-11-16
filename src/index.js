require('./utils/^^');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, IndexRoute } from 'react-router';

import * as ethutil from './utils/ethutil'
import * as actions from './actions'
import * as constants from './constants'
import { evaluateRouting } from './routing'

import App from './containers/App';
import Home from './containers/Home';
import Level from './containers/Level';
import Contest from './containers/Contest';
import Help from './containers/Help';
import About from './containers/About';
import Stats from './containers/Stats';
import Highscore from './containers/Highscore';
import NotFound404 from './components/NotFound404';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './styles/app.css';

// Initial actions
store.dispatch(actions.loadLevelsData())

// View entry point.
ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route path={constants.PATH_ROOT} component={App}>
        <IndexRoute onEnter={evaluateRouting} component={Home}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_HELP} component={Help}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_ABOUT} component={About}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_LEVEL} component={Level}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_CONTEST} component={Contest}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_STATS} component={Stats}/>
        <Route onEnter={evaluateRouting} path={constants.PATH_HIGHSCORE} component={Highscore}/>
        <Route path='*' exact={true} component={NotFound404}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// Post-load actions.
window.addEventListener('load', function() {
  if(window.web3) {

    ethutil.setWeb3(window.web3)
    ethutil.attachLogger()

    // Initial web3 related actions
    store.dispatch(actions.connectWeb3(window.web3))
    window.web3.eth.getAccounts(function (error, accounts) {
      let player;
      if(accounts.length !== 0 && !error) player = accounts[0]
      store.dispatch(actions.setPlayerAddress(player))
      store.dispatch(actions.checkAllLevelsCompleted())
      store.dispatch(actions.loadEthernautContract())
      ethutil.watchAccountChanges(acct => {
        store.dispatch(actions.setPlayerAddress(acct))
      }, player)
      ethutil.watchNetwork({
        gasPrice: price => store.dispatch(actions.setGasPrice(Math.floor(price * 1.1))),
        networkId: id => {
          checkWrongNetwork(id)
          if(id !== store.getState().network.networkId)
            store.dispatch(actions.setNetworkId(id))
        },
        blockNum: num => {
          if(num !== store.getState().network.blockNum)
            store.dispatch(actions.setBlockNum(num))
        }
      })
      evaluateRouting()
    })
  }
});

function checkWrongNetwork(id) {

  let onWrongNetwork = false
  if(constants.ACTIVE_NETWORK.id === constants.NETWORKS.DEV.id) {
    onWrongNetwork = parseInt(id, 10) < 1000
  }
  else {
    onWrongNetwork = constants.ACTIVE_NETWORK.id !== id
  }

  if(onWrongNetwork) {
    console.error(`Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`)
  }

  return onWrongNetwork
}