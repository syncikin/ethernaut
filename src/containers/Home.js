import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constants from '../constants'

class Home extends React.Component {

  navigateToFirstIncompleteLevel() {

    // Find first incomplete level
    let target = this.props.levels[0].factoryContractDeployedAddress
    for(let i = 0; i < this.props.levels.length; i++) {
      const level = this.props.levels[i]
      const completed = this.props.completedLevels[level.factoryContractDeployedAddress]
      if(!completed) {
        target = level.factoryContractDeployedAddress
        break
      }
    }

    // Navigate to first incomplete level
    this.props.router.push(`${constants.PATH_LEVEL_ROOT}${target}`)
  }

  render() {
    return (
      <div
        className="row"
        style={{
        paddingLeft: '40px',
        paddingRight: '40px',
      }}>

        <div className="col-sm-8">

          {/* TITLE */}
          <h2 className="title">
            The Ethernaut&nbsp;
            <small style={{ fontSize: 10 }}>by</small>
            <a href='https://zeppelin.solutions' target="_blank" rel="noopener noreferred">
              <img style={{ maxWidth: '120px' }} src='../../imgs/zeppelin-by-logo.png' alt='Zeppelin'/>
            </a>
          </h2>
          {/* INFO */}
          <p>The ethernaut is a Web3/Solidity based wargame inspired on <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a> and the <a href="https://en.wikipedia.org/wiki/The_Eternaut" target="_blank" rel="noopener noreferred">El Eternauta</a> comic, played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked' in order to advance.</p>

          <div className="well">
            <p>There are <strong>$10,000 USD in prizes</strong> for the first five participants to complete all challenges! <a href="https://blog.zeppelin.solutions/join-zeppelins-ctf-hacking-game-to-celebrate-devcon3-8ad2c01a0103" target="_blank" rel="noopener noreferred">Learn more</a>.</p>
            <p>Whoever can successfully solve all Ethernaut challenges will be moved to the top of our candidate list for the <a href="https://zeppelin.solutions/about#jobs">open positions</a> at Zeppelin.</p>
            <small style={{fontWeight: 'bold'}}>‹’’›(Ͼ˳Ͽ)‹’’› The contest is now closed!</small>
          </div>

          <p>Ethernaut has moved to <a href="https://ethernaut.zeppelin.solutions" target="_blank" rel="noopener noreferred">ethernaut.zeppelin.solutions</a> and is now open source! This version is still 100% playable, but the open source version is where the full will be.</p>

          <p>Are you interested in smart contract development or security? Does securing the world’s blockchain infrastructure sound exciting to you? <a href="https://zeppelin.solutions/about#jobs" target="_blank" rel="noopener noreferred"><strong style={{ color: '#eb5424', fontWeight: 600 }}>We are hiring!</strong></a></p>

          <button
            style={{marginTop: '10px'}}
            className="btn btn-primary"
            onClick={() => this.navigateToFirstIncompleteLevel()}
          >
            Play now! 
          </button>
        </div>

        <div className="col-sm-4">
          <img style={{maxWidth: '100%', padding: '40px 0 20px 0'}} src='../../imgs/ver.jpg' alt='eternauta'/>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    levels: state.levels.list,
    completedLevels: state.player.completedLevels
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
