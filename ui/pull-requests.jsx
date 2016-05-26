import React from 'react'
import { connect } from 'react-apollo'
import moment from 'moment'
import gql from 'apollo-client/gql'
import Filters from './filters.jsx'
import Loader from './loader.jsx'

const PullRequestsInner = React.createClass({
  propTypes: {
    pullRequestData: React.PropTypes.object,
    owner: React.PropTypes.string
  },
  getInitialState () {
    return {
      owner: [this.props.owner],
      repo: [],
      user: []
    }
  },
  updateFilters (filter, value) {
    this.setState({ [filter]: value })
    if (filter === 'owner') {
      this.setState({ repo: [], user: [] })
      this.props.pullRequestData.refetch({ owner: value })
    }
  },
  render () {
    if (!this.props.pullRequestData.pullRequests) return (<Loader loading={this.props.pullRequestData.loading} />)
    const filters = this.state
    const filteredPullRequests = this.props.pullRequestData.pullRequests.filter((pr) => {
      return (
        (!filters.owner.length || filters.owner.some((owner) => owner === pr.repo.owner)) &&
        (!filters.repo.length || filters.repo.some((repo) => repo === pr.repo.fullName)) &&
        (!filters.user.length || filters.user.some((user) => user === pr.user.login))
      )
    })
    return (
      <div>
        <Filters updateFilters={this.updateFilters} pullRequests={this.props.pullRequestData.pullRequests} filterValues={this.state} />
        <Loader loading={this.props.pullRequestData.loading} />
        {filteredPullRequests.map((pullRequest, ind) => (<PullRequest key={ind} pullRequest={pullRequest} />))}
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
            <a href={pr.repo.url} target='_blank'>{pr.repo.fullName}</a>
          </div>
          <div>
            <span className='pr-title'><a href={pr.url} target='_blank'>{pr.title}</a></span>
            <span className='username'>(<a href={pr.user.url} target='_blank'>{pr.user.login}</a>)</span>
          </div>
        </span>
        <span className='last-update'>
          <div>
            Last updated at {moment(pr.updatedAt).format('hh:mm on DD MMM YY')}
          </div>
        </span>
        <span className='created'>
          <div>
            {moment(pr.createdAt).format('DD MMM YY')}
          </div>
        </span>
        <span className='traffic-light'>
          <svg height={50} width={50}>
            <circle cx={25} cy={25} r={25} fill={colorString} />
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
        query PullRequests($owner: [String]) {
          pullRequests(owner: $owner) {
            title
            body
            url
            createdAt
            updatedAt
            repo {
              fullName
              owner
              url
            }
            user {
              login
              url
            }
            assignee {
              name
            }
          }
        }
      `,
      variables: {
        owner: [ownProps.owner]
      }
    }
  }
}

const PullRequests = connect({ mapQueriesToProps })(PullRequestsInner)

export default React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },
  render () {
    if (!this.props.user || !this.props.user.login) return null
    return (<PullRequests owner={this.props.user.login} />)
  }
})
