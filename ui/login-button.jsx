import React from 'react'
import Loader from './loader.jsx'
import { ddpConnect } from './ddp-connect.jsx'

const LoginButton = React.createClass({
  propTypes: {
    connected: React.PropTypes.bool,
    subsReady: React.PropTypes.bool,
    users: React.PropTypes.object
  },
  render () {
    if (!this.props.connected || !this.props.subsReady) return (<Loader loading={true} />)
    console.log(this.props.users)
    const username = this.props.users[0] && this.props.users[0].name
    if (username) {
      return (<p>Logged in as {username}</p>)
    }
    return (
      <a className='btn btn-primary btn-large' href='/login'>Login</a>
    )
  }
})

function mapSubsToProps (ownProps) {
  return {
    users: []
  }
}

export default ddpConnect(mapSubsToProps)(LoginButton)
