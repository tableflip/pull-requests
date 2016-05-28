import React from 'react'
import { ddpConnect } from './ddp-connect.jsx'

function getSelected (selectNode) {
  return Array.from(selectNode.options).reduce((vals, opt) => {
    if (opt.selected) vals.push(opt.value)
    return vals
  }, [])
}

Object.values = function (obj) {
  return Object.keys(obj).map((key) => obj[key])
}

const Filters = React.createClass({
  propTypes: {
    updateFilters: React.PropTypes.func,
    pullRequests: React.PropTypes.arrayOf(React.PropTypes.object),
    owners: React.PropTypes.object,
    filterValues: React.PropTypes.object,
    subsReady: React.PropTypes.bool
  },
  onChange (evt) {
    this.props.updateFilters(evt.target.name, getSelected(evt.target))
  },
  render () {
    if (!this.props.subsReady) return null
    const filterOpts = this.props.pullRequests.reduce((opts, pr) => {
      opts.repos.add(pr.base.repo.full_name)
      opts.users.add(pr.user.login)
      return opts
    }, {
      repos: new Set(),
      users: new Set()
    })
    return (
      <div className='row'>
        <fieldset className='form-group col-md-4'>
          <label htmlFor='owner'>Owner</label>
          <select multiple className='form-control' id='owner' name='owner' onChange={this.onChange} value={this.props.filterValues.owner}>
            {Object.values(this.props.owners).map((owner, ind) => {
              return (<option key={ind} value={owner._id}>{owner._id}</option>)
            })}
          </select>
        </fieldset>
        <fieldset className='form-group col-md-4'>
          <label htmlFor='repo'>Repo</label>
          <select multiple className='form-control' id='repo' name='repo' onChange={this.onChange} value={this.props.filterValues.repo}>
            {Array.from(filterOpts.repos).map((repo, ind) => {
              return (<option key={ind} value={repo}>{repo}</option>)
            })}
          </select>
        </fieldset>
        <fieldset className='form-group col-md-4'>
          <label htmlFor='user'>User</label>
          <select multiple className='form-control' id='user' name='user' onChange={this.onChange} value={this.props.filterValues.user}>
            {Array.from(filterOpts.users).map((user, ind) => {
              return (<option key={ind} value={user}>{user}</option>)
            })}
          </select>
        </fieldset>
      </div>
    )
  }
})

function mapSubsToProps () {
  return {
    owners: []
  }
}

export default ddpConnect(mapSubsToProps)(Filters)
