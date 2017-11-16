import { store } from './store';
import * as constants from './constants'
import { push } from 'react-router-redux';
import _ from 'lodash';

export function evaluateRouting() {

  const currentPath = getCurrentPath()
  // console.log(`<< evaluateRouting >>`, currentPath, constants.PATH_CONTEST)

  // out of contest/ (if levels are not completed)
  if( constants.RESTRICT_CONTEST_TO_ALL_LEVELS_COMPLETE &&
      currentPath === constants.PATH_CONTEST &&
      store.getState().player.address && !store.getState().player.allLevelsCompleted
  ) { navigateToPath(constants.PATH_ROOT) }
}

function navigateToPath(nextPath) {
  const currentPath = getCurrentPath();
  if(currentPath === nextPath) return;
  console.log(`redirect -> from: ${currentPath} to: ${nextPath}`);
  store.dispatch(push(nextPath));
}

function getCurrentPath() {
  const currentPath = store.getState().routing.locationBeforeTransitions.pathname;
  if (currentPath.length === 1) return currentPath;
  return _.trimEnd(currentPath, '/');
}