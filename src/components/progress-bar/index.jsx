import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')
class ProgressBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    this.touch = {}
  }

  progressTouchStart (e) {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.refs.progress.clientWidth
  }
  progressTouchMove (e) {
    if (!this.touch.initiated) {
      return
    }
    const deltaX = e.touches[0].pageX - this.touch.startX
    const offsetWidth = Math.min(this.refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
    this._offset(offsetWidth)
  }
  progressTouchEnd () {
    this.touch.initiated = false
    this._triggerPercent()
  }
  progressClick (e) {
    const rect = this.refs.progressBar.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    this._offset(offsetWidth)
    // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
    // this._offset(e.offsetX)
    this._triggerPercent()
  }
  _triggerPercent () {
    const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.refs.progress.clientWidth / barWidth
    let propss = this.props
    propss.percentChange(percent)
  }
  _offset (offsetWidth) {
    this.refs.progress.style.width = `${offsetWidth}px`
    this.refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  }
  componentWillReceiveProps () {
    let propss = this.props
    let newPercent = propss.percent
    if (newPercent >= 0 && !this.touch.initiated) {
      const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this._offset(offsetWidth)
    }
  }
  render () {
    return (
      <div className='progress-bar' ref='progressBar' onClick={(e) => this.progressClick(e)}>
        <div className='bar-inner'>
          <div className='progress' ref='progress' />
          <div className='progress-btn-wrapper' ref='progressBtn'
            onTouchStart={(e) => this.progressTouchStart(e)}
            onTouchMove={(e) => this.progressTouchMove(e)}
            onTouchEnd={(e) => this.progressTouchEnd(e)}
          >
            <div className='progress-btn' />
          </div>
        </div>
      </div>
    )
  }
}
ProgressBar.contextTypes = {
  percent: PropTypes.number,
  percentChange: PropTypes.func
}
export default ProgressBar
