import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { EMAIL_RECIPIENT, EMAIL_SUBJECT } from '../constants';
import * as ethutil from '../utils/ethutil'
import _ from 'lodash';

import '../styles/page.css'

const mailTemplate = _.template(`I've just completed the Ethernaut contest!
Here is my information:

<%= signedMessage %>
`)

class Contest extends React.Component {

  constructor() {
    super()
    this.onSendMail = this.onSendMail.bind(this);
    this.state = {
      email: '',
      signature: signatureTemplate(),
      emailError: '',
      signatureError: '',
      showMailNotice: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateSignature(nextProps.playerAddress, this.state.email)
  }

  signWithMetamask() {
    if(!this.validate(false)) return
    ethutil.signMessageWithMetamask(
      this.props.playerAddress,
      this.state.email,
      (json) => {
        this.setState({
          signature: JSON.stringify(json, null, 2)
        })
      })
  }

  updateSignature(address, msg) {
    this.setState({
      email: msg,
      signature: signatureTemplate(address, msg),
      emailError: '',
      signatureError: '',
      showMailNotice: false
    })
  }

  validate(validateSignature) {
    if(!validateNotEmpty(this.state.email)) {
      this.setState({
        emailError: 'Please enter your email'
      })
      return false
    }
    if(!validateEmail(this.state.email)) {
      this.setState({
        emailError: 'Please enter a valid email'
      })
      return false
    }
    if(validateSignature) {
      if(!validateNotEmpty(this.state.signature)) {
        this.setState({
          signature: 'Please enter your signature with metamask'
        })
        return false
      }
    }
    return true
  }

  onSendMail(event) {
    if (!validateSignature(this.state.signature)) {
      event.preventDefault();
    } else {
      this.setState({ showMailNotice: true });
    }
  }

  mailtoLink() {
    const body = encodeURIComponent(mailTemplate({ signedMessage: this.state.signature }));
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    return `mailto:${EMAIL_RECIPIENT}?subject=${subject}&body=${body}`
  }

  render() {
    const signatureIsValid = validateSignature(this.state.signature)

    return (
      <div className="page-container">
        <h2>Send us your score.</h2>
        <div className="row">
          <div className="col-sm-6">
            <p>
              Sign a message containing your email with the ethereum address you used to play the game and send it to us. We will have a look at your game data and get in touch with you.
            </p>
            <form style={{margin: '0px 0 40px 0'}} onSubmit={evt => evt.preventDefault()}>

              {/* EMAIL */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type='text'
                  className="form-control"
                  onChange={(evt) => this.updateSignature(this.props.playerAddress, evt.target.value)}
                  value={this.state.email}
                />
                <div className='text-danger'>
                  {this.state.emailError}
                </div>
              </div>

              {/* SIGNATURE */}
              <div className="form-group">
                <label>Signature</label>
                <textarea readOnly={true}
                  style={{height: '140px', resize: 'vertical'}}
                  type='text'
                  className="form-control"
                  value={this.state.signature}
                />
                <div className='text-danger'>
                  {this.state.signatureError}
                </div>
              </div>

              {/* BUTTONS */}
              <button
                type="button"
                className='btn btn-primary'
                onClick={evt => this.signWithMetamask()}
              >
                Sign with metamask
              </button>
              <a
                disabled={!signatureIsValid}
                href={this.mailtoLink()}
                target="_blank"
                className={`btn btn-${signatureIsValid ? 'warning' : 'default'}`}
                onClick={this.onSendMail}
              >
                Send
              </a>
    
              {this.state.showMailNotice && (
              <p>
                <i>Mail client not set up or mailto handler not working? Send us an email to <u>{EMAIL_RECIPIENT}</u> with the signature shown above.</i>
              </p>
              )}

              { signatureIsValid &&
                <p>
                  Verify the signature yourself <a href="https://etherchain.org/verify/signature" target="_blank" rel="noreopener noreferred">here</a>.
                </p>
              }

            </form>
          </div>
          <div className="col-sm-6">
            <img style={{maxWidth: '100%', paddingBottom: '20px'}} src='../../imgs/pinch.jpg' alt=''/>
          </div>
        </div>
      </div>
    )
  }
}

function validateSignature(signature) {
  let valid = false
  try{
    valid = ethutil.verifySignature(JSON.parse(signature))
  } catch(e) {
    return false
  }
  return valid
}

function signatureTemplate(address, email) {
  return `{
  "address": "${address || ''}",
  "msg": "${email || ''}",
  "sig": "",
  "version": "2"
}`
}

function validateEmail(email) {
  // eslint-disable-next-line
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function validateNotEmpty(value) {
  return !!(value && value.trim());
}

function mapStateToProps(state) {
  return {
    playerAddress: state.player.address,
    completedLevels: state.player.completedLevels
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contest);
