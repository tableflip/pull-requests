import React from 'react'
import equals from 'equals'

export function ddpConnect (mapSubsToProps, mapMethodsToProps = () => ({})) {
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
          collections: Object.keys(subObj).reduce((collObj, key) => {
            collObj[key] = []
            return collObj
          }, {}),
          connected: false
        }
      },
      subs: {},
      subscribe (key) {
        this.subs[key] = {}
        this.subs[key].sub = this.context.ddpClient.subscribe(key, this.state.subObj[key], () => {
          this.setState({
            subs: Object.assign({}, this.state.subs, { [key]: true })
          })
        })
        this.subs[key].observer = this.context.ddpClient.observe(key)
        this.subs[key].observer.added = this.updateCollection.bind(this, key)
        this.subs[key].observer.changed = this.updateCollection.bind(this, key)
        this.subs[key].observer.removed = this.updateCollection.bind(this, key)
      },
      updateCollection (key) {
        this.setState({ collections: Object.assign({}, this.state.collections, { [key]: this.context.ddpClient.collections[key] }) })
      },
      unsubscribe (key) {
        this.subs[key].observer.stop()
        this.context.ddpClient.unsubscribe(this.subs[key].sub)
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
        const methods = mapMethodsToProps(this.props)
        const ddpClient = this.context.ddpClient
        const addedProps = Object.keys(this.state.subObj).reduce((props, sub) => {
          props[sub] = this.state.collections[sub]
          return props
        }, Object.keys(methods).reduce((props, method) => {
          props[method] = function () {
            let args = Array.from(arguments)
            let cb = null
            if (typeof args[args.length - 1] === 'function') cb = args.pop()
            ddpClient.call(methods[method], args, cb)
          }
          return props
        }, {
          subs: this.state.subs,
          connected: this.context.connected,
          subsReady: Object.keys(this.state.subObj).reduce((ready, sub) => ready && this.state.subs[sub], true)
        }))
        return (
          <ChildComponent {...this.props} {...addedProps} />
        )
      }
    })
  }
}
