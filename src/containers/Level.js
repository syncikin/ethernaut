import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CodeComponent from '../components/Code'
import MarkdownComponent from '../components/Markdown'
import RandomImage from '../components/RandomImage'
import * as actions from '../actions'
import * as constants from '../constants'
import Difficulty from '../components/Difficulty'

class Level extends React.Component {

  componentWillMount() {
    this.props.activateLevel(this.props.routeParams.address)
  }

  componentWillUnmount() {
    if(this.props.activateLevel) {
      this.props.deactivateLevel(this.props.activateLevel);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.level.factoryContractDeployedAddress !== nextProps.routeParams.address)
      this.props.activateLevel(nextProps.routeParams.address)
  }

  render() {

    const {
      level,
      levelCompleted
    } = this.props;

    if(!level) return null
    const showCode = levelCompleted || level.revealInstanceContractCode
    const showCompletedDescription = constants.SHOW_ALL_COMPLETE_DESCRIPTIONS || levelCompleted

    let descriptionFile = null
    try { descriptionFile = require(`../../levels/descriptions/${level.descriptionFile}`) } catch(e){}
    let completedDescriptionFile = null
    if(showCompletedDescription && level.completedDescriptionFile) {
      try { completedDescriptionFile = require(`../../levels/descriptions/${level.completedDescriptionFile}`) } catch(e){}
    }
    let sourcesFile = null
    try { sourcesFile = require(`../../contracts/levels/${level.instanceContractName}.sol`) } catch(e){}

    const nextLevelId = findNextLevelId(this.props.level, this.props.levels)

    return (
      <div className="page-container">

        <div className="page-header row">
          {/* TITLE + INFO */}
          <div className="level-title col-sm-6">
            <h2 className="title no-margin">{level.name}</h2>
            { levelCompleted === true && <span className='label label-default'>Level completed!</span>}
          </div>
          <div className="difficulty col-sm-6 right">
            <Difficulty level={parseInt(level.difficulty, 10)}/>
          </div>
          <div className="clearfix"/>
        </div>

        {/* DESCRIPTION */}
        { descriptionFile && <MarkdownComponent target={descriptionFile}/> }

        {/* COMPLETED DESCRIPTION */}
        { showCompletedDescription &&
        <div style={{marginTop: '40px', marginBottom: '40px'}}>
          { completedDescriptionFile && <div className='well'><MarkdownComponent target={completedDescriptionFile}/></div> }
        </div>
        }

        {/* BUTTONS */}
        <div className="" style={{marginTop: '5px'}}>

          { level.factoryContractName &&
          <div className="">

            {/* CREATE */}
            <button
              type="button"
              className='btn btn-primary'
              onClick={evt => this.props.loadLevelInstance(level, false)}
            >
              Get new instance
            </button>

            {/* SUBMIT */}
            { this.props.levelEmitted &&
            <button
              type="button"
              className='btn btn-warning'
              onClick={evt => this.props.submitLevelInstance(level)}
            >
              Submit instance
            </button>
            }

            {/* NEXT LEVEL */}
            { levelCompleted && nextLevelId &&
            <button
              type="button"
              className='btn btn-info'
              onClick={evt => this.props.router.push(`${constants.PATH_LEVEL_ROOT}${nextLevelId}`)}
            >
              Go to the next level!
            </button>
            }

          </div>
          }
        </div>

        {/* CODE */}
        { showCode && sourcesFile &&
        <div style={{marginTop: '50px'}}>
          <div className='page-header'><h3>Sources</h3></div>
          <CodeComponent target={sourcesFile}/>
        </div>
        }

        <RandomImage/>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const level = state.levels.activeLevel
  return {
    level: level,
    levels: state.levels.list,
    levelCompleted: level && state.player.completedLevels[level.factoryContractDeployedAddress] > 0,
    levelEmitted: level && state.contracts.levels[level.factoryContractDeployedAddress] !== undefined
  };
}

function findNextLevelId(level, list) {
  for(let i = 0; i < list.length; i++) {
    const otherLevel = list[i]
    if(level.factoryContractDeployedAddress === otherLevel.factoryContractDeployedAddress) {
      if(i < list.length - 1) {
        return list[i+1].factoryContractDeployedAddress
      }
      else return null
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    activateLevel: actions.activateLevel,
    deactivateLevel: actions.deactivateLevel,
    loadLevelInstance: actions.loadLevelInstance,
    submitLevelInstance: actions.submitLevelInstance,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Level);