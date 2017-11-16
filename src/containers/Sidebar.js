import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router'
import * as constants from '../constants'

class Sidebar extends React.Component {
  render() {
    return (
      <div style={{
        padding: '15px 10px'
      }}>

        {/* TITLE */}
        <h4 className="levels-list-title">Levels</h4>

        {/* LIST */}
        <div className="levels-list">
          {this.props.levels.map((level, idx) => {

            // Style
            let linkStyle = {}
            if(this.props.activeLevel) {
              if(this.props.activeLevel.factoryContractDeployedAddress === level.factoryContractDeployedAddress) {
                linkStyle.textDecoration = 'underline'
              }
            }

            // Level completed
            const levelComplete = this.props.player.completedLevels[level.factoryContractDeployedAddress] > 0

            return (
              <div key={idx}>
                <Link to={`${constants.PATH_LEVEL_ROOT}${level.factoryContractDeployedAddress}`}>
                  <span style={linkStyle}>
                    {`${idx}. ${level.name}${levelComplete ? ' ✔' : ''}`}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.levels.list,
    player: state.player,
    activeLevel: state.levels.activeLevel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // activateLevel: actions.activateLevel
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);