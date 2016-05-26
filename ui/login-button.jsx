import React from 'react'
import Loader from './loader.jsx'

export default React.createClass({
  propTypes: {
    userDoc: React.PropTypes.object
  },
  render () {
    if (this.props.userDoc.loading) return (<Loader loading={true} />)
    if (this.props.userDoc.user.name) {
      return (<p>Logged in as {this.props.userDoc.user.name}</p>)
    }
    return (
      <a className='btn btn-primary btn-large' href='/login'>Login</a>
    )
  }
})
