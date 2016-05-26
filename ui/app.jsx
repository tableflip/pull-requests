import React from 'react'
import { connect } from 'react-apollo'
import gql from 'apollo-client/gql'
import LoginButton from './login-button.jsx'
import PullRequests from './pull-requests.jsx'

const App = React.createClass({
  propTypes: {
    userDoc: React.PropTypes.object
  },
  render () {
    return (
      <div className='container p-y-1'>
        <h1>Pull Requests</h1>
        <LoginButton userDoc={this.props.userDoc} />
        <hr />
        <PullRequests />
      </div>
    )
  }
})

function mapQueriesToProps ({ ownProps, state }) {
  return {
    userDoc: {
      query: gql`
        query UserDoc {
          user {
            name
            type
            company
            avatar
          }
          repos {
            fullName
          }
        }
      `
    }
  }
}

export default connect({ mapQueriesToProps })(App)
