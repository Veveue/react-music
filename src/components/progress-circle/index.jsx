/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class ProgressCircle extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dashArray: Math.PI * 100
    }
  }
  dashOffset () {
    return (1 - this.props.percent) * this.state.dashArray || 0
  }
  componentWillReceiveProps () {
  }
  render () {
    return (
      <div className='progress-circle'>
        <svg viewBox='0 0 100 100' version='1.1' xmlns='http://www.w3.org/2000/svg'>
          <circle className='progress-background' r='50' cx='50' cy='50' fill='transparent' />
          <circle className='progress-bar' r='50' cx='50' cy='50' fill='transparent' strokeDasharray={this.state.dashArray}
            strokeDashoffset={this.dashOffset()} />
        </svg>
        {this.props.children}
      </div>
    )
  }
}
ProgressCircle.contextTypes = {
  children: PropTypes.node
}
export default ProgressCircle
