import React from 'react'
import { connect } from 'react-apollo'
import moment from 'moment'
import gql from 'apollo-client/gql'

const PullRequests = React.createClass({
  propTypes: {
    pullRequestData: React.PropTypes.object
  },
  render () {
    if (this.props.pullRequestData.loading) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div>
        {this.props.pullRequestData.pullRequests.map((pullRequest, ind) => (<PullRequest key={ind} pullRequest={pullRequest} />))}
      </div>
    )
  }
})

const PullRequest = React.createClass({
  propTypes: {
    pullRequest: React.PropTypes.object
  },
  render () {
    const pr = this.props.pullRequest
    const age = Math.min(moment().diff(pr.createdAt, 'days') * 3, 255)
    const colorString = `rgb(${age}, ${255 - age}, 0)`
    return (
      <div className='pull-request'>
        <span className='main-info'>
          <div className='repo-name'>
            {pr.repo.fullName}
          </div>
          <div>
            <span className='pr-title'>{pr.title}</span>
            <span className='username'>(<a href={pr.user.url}>{pr.user.name}</a>)</span>
          </div>
        </span>
        <span className='comments'>
          <div>
            14 comments
          </div>
        </span>
        <span className='updated'>
          <div>
            {moment(pr.updatedAt).format('DD MMM YY')}
          </div>
        </span>
        <span className='traffic-light'>
          <svg height={60} width={60}>
            <circle cx={30} cy={30} r={30} fill={colorString} />
          </svg>
        </span>
      </div>
    )
  }
})

function mapQueriesToProps ({ ownProps, state }) {
  return {
    pullRequestData: {
      query: gql`
        query PullRequests {
          pullRequests {
            repo {
              fullName
            }
            url
            user {
              name
              url
            }
            assignee {
              name
            }
            title
            body
            createdAt
            updatedAt
          }
        }
      `
    }
  }
}

export default connect({ mapQueriesToProps })(PullRequests)
