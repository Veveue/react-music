import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class Test extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }
  componentWillMount () {
  }
  render () {
    return (
      <div className='recommend' ref='recommend'>
        {this.props.children}
      </div>
    )
  }
}
export default Test
