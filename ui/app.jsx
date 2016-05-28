import React from 'react'
// import { connect } from 'react-apollo'
// import gql from 'apollo-client/gql'
import makeDDPClient from './ddp-client'
import LoginButton from './login-button.jsx'
import PullRequests from './pull-requests.jsx'

export default React.createClass({
  propTypes: {
    userDoc: React.PropTypes.object
  },
  getInitialState () {
    return {
      connected: false,
      ddpClient: {}
    }
  },
  childContextTypes: {
    ddpClient: React.PropTypes.object,
    connected: React.PropTypes.bool
  },
  getChildContext () {
    return {
      ddpClient: this.state.ddpClient,
      connected: this.state.connected
    }
  },
  ddpClient: {},
  componentDidMount () {
    this.setState({ ddpClient: makeDDPClient((connected) => this.setState({ connected })) })
  },
  render () {
    return (
      <div className='container p-y-1'>
        <h1>Pull Requests</h1>
        <LoginButton />
        <hr />
        <PullRequests />
      </div>
    )
  }
})
