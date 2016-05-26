import React from 'react'

export default React.createClass({
  propTypes: {
    userDoc: React.PropTypes.object
  },
  render () {
    if (this.props.userDoc.loading) return (<p>Logging in...</p>)
    if (this.props.userDoc.user.name) {
      return (<p>Logged in as {this.props.userDoc.user.name}</p>)
    }
    return (
      <a className='btn btn-primary btn-large' href='/login'>Login</a>
    )
  }
})
