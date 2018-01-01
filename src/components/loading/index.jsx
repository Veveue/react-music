import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class Loading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const {title} = this.props
    return (
      <div className='loading'>
        <img width='24' height='24' src='/static/img/loading.gif' />
        <p className='desc'>{title}</p>
      </div>
    )
  }
}

Loading.defaultProps = {
  title: '正在载入...'
}

Loading.propTypes = {
  title: PropTypes.string
}
export default Loading
