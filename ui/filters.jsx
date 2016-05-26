import React from 'react'
import { connect } from 'react-apollo'
import gql from 'apollo-client/gql'

function getSelected (selectNode) {
  return Array.from(selectNode.options).reduce((vals, opt) => {
    if (opt.selected) vals.push(opt.value)
    return vals
  }, [])
}

const Filters = React.createClass({
  propTypes: {
    updateFilters: React.PropTypes.func,
    pullRequests: React.PropTypes.arrayOf(React.PropTypes.object),
    ownersData: React.PropTypes.object,
    filterValues: React.PropTypes.object
  },
  onChange (evt) {
    this.props.updateFilters(evt.target.name, getSelected(evt.target))
  },
  render () {
    if (this.props.ownersData.loading) return null
    const filterOpts = this.props.pullRequests.reduce((opts, pr) => {
      opts.repos.add(pr.repo.fullName)
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
            {this.props.ownersData.owners.map((owner, ind) => {
              return (<option key={ind} value={owner}>{owner}</option>)
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

function mapQueriesToProps ({ ownProps, state }) {
  return {
    ownersData: {
      query: gql`
        query Repos {
          owners
        }
      `
    }
  }
}

export default connect({ mapQueriesToProps })(Filters)
