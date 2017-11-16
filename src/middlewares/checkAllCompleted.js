import * as actions from '../actions'
import * as constants from '../constants'
import { push } from 'react-router-redux';

export default store => next => async action => {
  if(action.type !== actions.CHECK_ALL_COMPLETED) return next(action)
  if(action.allCompleted) return next(action)

  const state = store.getState()

  const allCompleted = allLevelsCompleted(state.levels.list, state.player.completedLevels)
  // console.log(`ALL COMPLETED:`, allCompleted)
  if(allCompleted) {
    console.victory(`@good @good @good`, `@good ALL LEVELS COMPLETED`)
    setTimeout(() => {
      console.secret(`<<< Congratulations! You won Ethernaut DEVCON3 edition... use the contest() command to submit your entry and have a chance to win prizes and interview for the Zeppelin team!! >>>`)
    }, 5000)
    window.contest = function() {
      store.dispatch(push(constants.PATH_CONTEST))
      console.greet(`Send us your signature!`)
    }
  }

  action.allCompleted = allCompleted
  next(action)
}

function allLevelsCompleted(list, completedLevels) {
  for(let i = 0; i < list.length; i++) {
    const level = list[i]
    const completed = completedLevels[level.factoryContractDeployedAddress]
    if(!completed) return false
  }
  return true
}
