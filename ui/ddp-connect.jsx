import React from 'react'
import equals from 'equals'

export function ddpConnect (mapSubsToProps) {
  return (ChildComponent) => {
    return React.createClass({
      contextTypes: {
        ddpClient: React.PropTypes.object,
        connected: React.PropTypes.bool
      },
      getInitialState () {
        const subObj = mapSubsToProps(this.props)
        return {
          subObj,
          subs: Object.keys(subObj).reduce((stateObj, key) => {
            stateObj[key] = false
            return stateObj
          }, {}),
          connected: false
        }
      },
      subscribe (key) {
        this[key] = {}
        this[key].sub = this.context.ddpClient.subscribe(key, this.state.subObj[key], () => {
          this.setState({
            subs: Object.assign({}, this.subs, { [key]: true })
          })
        })
        this[key].observer = this.context.ddpClient.observe('users')
        this[key].observer.added = this.forceUpdate.bind(this, null)
        this[key].observer.changed = this.forceUpdate.bind(this, null)
        this[key].observer.removed = this.forceUpdate.bind(this, null)
      },
      unsubscribe (key) {
        this[key].observer.stop()
        this.context.ddpClient.unsubscribe(this[key].sub)
      },
      componentDidMount () {
        if (this.context.connected) Object.keys(this.state.subObj).forEach((key) => this.subscribe(key))
      },
      componentWillReceiveProps (nextProps, nextContext) {
        const oldSubObj = Object.assign({}, this.state.subObj)
        const subObj = mapSubsToProps(nextProps)
        if (!equals(oldSubObj, subObj)) {
          this.setState({ subObj }, () => {
            Object.keys(oldSubObj).forEach((key) => this.unsubscribe(key))
            Object.keys(subObj).forEach((key) => this.subscribe(key))
          })
        }
        if (!this.context.connected && nextContext.connected) {
          this.setState({ connected: true })
          return Object.keys(this.state.subObj).forEach((key) => this.subscribe(key))
        } else if (this.context.connected && !nextContext.connected) {
          this.setState({ connected: false })
          return Object.keys(this.state.subObj).forEach((key) => this.unsubscribe(key))
        }
      },
      componentWillUnmount () {
        Object.keys(this.state.subObj).forEach((key) => this.unsubscribe(key))
      },
      render () {
        const addedProps = Object.keys(this.state.subObj).reduce((props, sub) => {
          props[sub] = this.context.ddpClient.collections
            ? (this.context.ddpClient.collections[sub] || {})
            : {}
          return props
        }, {
          subs: this.state.subs,
          connected: this.context.connected,
          subsReady: Object.keys(this.state.subObj).reduce((ready, sub) => ready && this.state.subs[sub], true)
        })
        return (
          <ChildComponent {...this.props} {...addedProps} />
        )
      }
    })
  }
}
