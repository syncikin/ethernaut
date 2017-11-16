import * as actions from '../actions'
import * as constants from '../constants'

export default store => next => action => {
    if(action.type !== actions.LOAD_LEVELS_DATA) return next(action)

    try {

      // Load levels and add a bit of post processing...
      // console.log(`NETWORK NAME:`, constants.ACTIVE_NETWORK.name)
      // console.log(`LEVELS URL:`, `../../levels/levels-${constants.ACTIVE_NETWORK.name}.json`)
      const data = require(`../../levels/levels-${constants.ACTIVE_NETWORK.name}.json`)
      const levelsIn = data.levels;
      // console.log(`LEVELS DATA:`, levelsIn)
      const levelsOut = [];
      for(let i = 0; i < levelsIn.length; i++) {
        const level = levelsIn[i];
        level.idx = i;
        levelsOut.push(level);
      }
      action.ethernautDeployAddress = data.ethernautDeployAddress
      action.levels = levelsOut;
      // console.log(`LEVELS DATA (out):`, levelsOut, data.ethernautDeployAddress)
    } catch(e) {
      window.alert('cannot find levels data')
    }

    next(action)
}