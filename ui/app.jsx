import React from 'react'
import { connect } from 'react-apollo'
import gql from 'apollo-client/gql'

const App = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },
  render () {
    return (
      <div>
        <h1>Pull Requests</h1>
        <a className='btn btn-primary btn-large' href='/login'>Login</a>
        <hr />
        <p>
          <ul>
            <li>User loading: {this.props.user.loading ? 'true' : 'false'}</li>
            <li>User error: {this.props.user.errors ? this.props.user.errors.message : 'none'}</li>
            <li>Username: {this.props.user.user && this.props.user.user.name}</li>
          </ul>
        </p>
      </div>
    )
  }
})

function mapQueriesToProps ({ ownProps, state }) {
  return {
    user: {
      query: gql`
        query UserDoc {
          user {
            name
            type
            company
            avatar
          }
        }
      `
    }
  }
}

export default connect({ mapQueriesToProps })(App)
