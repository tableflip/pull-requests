import React from 'react'
import moment from 'moment'
import { ddpConnect } from './ddp-connect.jsx'
import Filters from './filters.jsx'
import Loader from './loader.jsx'

Object.values = function (obj) {
  return Object.keys(obj).map((key) => obj[key])
}

const PullRequests = React.createClass({
  propTypes: {
    pullRequests: React.PropTypes.array,
    loadingIndicator: React.PropTypes.array,
    subsReady: React.PropTypes.bool
  },
  getInitialState () {
    return {
      owner: [],
      repo: [],
      user: []
    }
  },
  updateFilters (filter, value) {
    this.setState({ [filter]: value })
    if (filter === 'owner') {
      this.setState({ repo: [], user: [] })
    }
  },
  render () {
    if (!this.props.subsReady || (this.props.loadingIndicator[0] && this.props.loadingIndicator[0].value)) return (<Loader />)
    const filters = this.state
    const pullRequests = Object.values(this.props.pullRequests || {})
    const filteredPullRequests = pullRequests.filter((pr) => {
      return (
        (!filters.owner.length || filters.owner.some((owner) => owner === pr.base.repo.owner.login)) &&
        (!filters.repo.length || filters.repo.some((repo) => repo === pr.base.repo.full_name)) &&
        (!filters.user.length || filters.user.some((user) => user === pr.user.login))
      )
    })
    return (
      <div>
        <Filters updateFilters={this.updateFilters} pullRequests={pullRequests} filterValues={this.state} />
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
    const age = Math.min(moment().diff(pr.created_at, 'days') * 3, 255)
    const colorString = `rgb(${age}, ${255 - age}, 0)`
    return (
      <div className='pull-request'>
        <span className='main-info'>
          <div className='repo-name'>
            <a href={pr.base.repo.html_url} target='_blank'>{pr.base.repo.full_name}</a>
          </div>
          <div>
            <span className='pr-title'><a href={pr.html_url} target='_blank'>{pr.title}</a></span>
            <span className='username'>(<a href={pr.user.html_url} target='_blank'>{pr.user.login}</a>)</span>
          </div>
        </span>
        <span className='last-update'>
          <div>
            Last updated at {moment(pr.updated_at).format('hh:mm on DD MMM YY')}
          </div>
        </span>
        <span className='created'>
          <div>
            {moment(pr.created_at).format('DD MMM YY')}
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

function mapSubsToProps () {
  return {
    pullRequests: [],
    repos: [],
    loadingIndicator: []
  }
}

export default ddpConnect(mapSubsToProps)(PullRequests)
