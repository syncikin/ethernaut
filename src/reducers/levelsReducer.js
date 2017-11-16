import * as actions from '../actions'

const initialState = {
  ethernautDeployAddress: undefined,
  activeLevel: undefined,
  list: []
}

export default function(state = initialState, action) {
  switch(action.type) {

    case actions.LOAD_LEVELS_DATA:
      return {
        ...state,
        list: action.levels,
        ethernautDeployAddress: action.ethernautDeployAddress
      }

    case actions.ACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: action.activeLevel
      }

    case actions.DEACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: undefined
      }

    default:
      return state
  }
}