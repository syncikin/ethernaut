import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
import _ from 'lodash'

import '../styles/page.css'

class Highscore extends React.Component {

  constructor() {
    super()
    this.state = {
      highscores: []
    }
  }

  componentWillMount() {
    this.props.collectStats()
  }

  componentWillReceiveProps(nextProps) {

    // Receiving completed level logs?
    if(nextProps.completedLevels && nextProps.completedLevels.length > 0) {
      // console.log(`completedLevels`, nextProps.completedLevels)

      // Get array of game levels
      const levels = _.map(this.props.levels, 'factoryContractDeployedAddress')
      // console.log(`levels:`, levels)

      // Addresses we dont consider
      const ignoredAddresses = [
        "0xf46e63c5d3461bc50bc63933385f03a5c7b4358c" // ajsantander
      ]
      
      // Get unique players.
      const players = _.uniq(_.map(this.props.createdInstances, 'args.player'))
      // console.log(`players`, players)

      // Sweep players and collect info.
      let highscores = [];
      for(let i = 0; i < players.length; i++) {

        // Find level completion logs for this player
        const player = players[i]
        if(ignoredAddresses.indexOf(player) !== -1) continue
        const logs = _.filter(nextProps.completedLevels, levelLog => {
          return levelLog.args.player === player
        })
        
        // Process logs
        let completedCount = logs.length
        let earliestBlock = 9999999999999999999999999999999999999999999999
        let latestBlock = -9999999999999999999999999999999999999999999999
        let points = 0
        for(let i = 0; i < logs.length; i++) {
          const log = logs[i]
          if(log.blockNumber < earliestBlock) earliestBlock = log.blockNumber
          if(log.blockNumber > latestBlock) latestBlock = log.blockNumber
          const logLevel = log.args.level
          if(levels.indexOf(logLevel) > 0) { // FIRST LEVEL (TUTORIAL) IS IGNORED
            points++
          }
        }

        // Push data
        if(points >= levels.length - 1) {
          highscores.push({
            player,
            completedCount,
            earliestBlock,
            latestBlock,
            logs: logs
          })
        }
      }
      
      // Sort data
      highscores = _.sortBy(highscores, ['latestBlock'])
      this.setState({
        highscores
      })
      // console.log(`highscores`, highscores)
    }
  }

  filter(player) {
    if(this.state.playerFilter !== '' && player !== '') {
      if(player !== this.state.playerFilter) return false
    }
    return true
  }

  render() {
    return (
      <div className="page-container">

        {/* HIGHSCORE */}
        <div>
          <h3>Contest winners</h3>
          { this.state.highscores.length === 0 &&
          <div>
            <span>Processing level complete logs...</span>
            <br/>
            <br/>
            <small className="text-info">Please make sure that your metamask extension is (1) installed (2) unlocked and (3) pointed at the ropsten network. If you still dont see any results try refreshing or even disabling and re-enabling your metamask extension as a last resort.</small>
          </div>
          }
          { this.state.highscores.length > 0 &&
          <table className="table">
            <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Completion block</th>
              <th>Delta blocks</th>
            </tr>
            </thead>
            <tbody>
            {_.map(this.state.highscores, (item, idx) => {
              let style = {}
              if(idx < 5) style = {fontWeight: 'bold', fontSize: 16}
              return (
                <tr key={item.logs[0].transactionHash}>
                  <td><small style={style}>{idx + 1}</small></td>
                  <td><small style={style}>{item.player}</small></td>
                  <td><small style={style}>{item.latestBlock}</small></td>
                  <td><small style={style}>{item.latestBlock - item.earliestBlock}</small></td>
                </tr>
              )
            })}
            </tbody>
          </table>
          }
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    createdInstances: state.stats.createdInstanceLogs,
    completedLevels: state.stats.completedLevelLogs,
    levels: state.levels.list
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    collectStats: actions.collectStats
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highscore)