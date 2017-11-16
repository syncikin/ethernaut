import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import networkReducer from './networkReducer'
import levelsReducer from './levelsReducer'
import playerReducer from './playerReducer'
import contractsReducer from './contractsReducer'
import statsReducer from './statsReducer'

const reducer = combineReducers({
  routing: routerReducer,
  network: networkReducer,
  levels: levelsReducer,
  player: playerReducer,
  contracts: contractsReducer,
  stats: statsReducer
});

export default reducer;