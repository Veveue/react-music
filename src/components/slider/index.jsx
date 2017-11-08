import React from 'react'
import PropTypes from 'prop-types'
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'
import './index.styl'
class Slider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dots: [],
      currentPageIndex: 0
    }
  }
  _setSliderWidth (isResize) {
    this.children = this.refs.sliderGroup.children
    let width = 0
    let sliderWidth = this.refs.slider.clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]
      addClass(child, 'slider-item')

      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    if (this.props.loop && !isResize) {
      width += 2 * sliderWidth
    }
    this.refs.sliderGroup.style.width = width + 'px'
  }
  _initSlider () {
    this.slider = new BScroll(this.refs.slider, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: true,
      snapLoop: this.props.loop,
      snapThreshold: 0.3,
      snapSpeed: 400
    })

    this.slider.on('scrollEnd', () => {
      let pageIndex = this.slider.getCurrentPage().pageX
      if (this.props.loop) {
        pageIndex -= 1
      }
      this.setState({currentPageIndex: pageIndex})
      if (this.props.autoPlay) {
        clearTimeout(this.timer)
        this._play()
      }
    })
  }
  _play () {
    let pageIndex = this.state.currentPageIndex + 1
    if (this.props.loop) {
      pageIndex += 1
    }
    this.timer = setTimeout(() => {
      this.slider.goToPage(pageIndex, 0, 400)
    }, this.props.interval)
  }
  componentWillUnmount () {
    clearTimeout(this.timer)
  }
  componentWillMount () {
  }
  componentDidMount () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()

      if (this.props.autoPlay) {
        this._play()
      }
    }, 0)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  }
  render () {
    let recommends = this.props.recommends
    let currentPageIndex = this.state.currentPageIndex
    return (
      <div className='slider' ref='slider'>
        <div className='slider-group' ref='sliderGroup'>
          {
            recommends.map(function (item, index) {
              return (
                <div key={index}><a href={item.linkUrl}>
                  <img className='needsclick' src={item.picUrl} /></a>
                </div>
              )
            })
          }
        </div>
        <div className='dots'>
          {
            recommends.map(function (item, index) {
              return (
                <span className={currentPageIndex === index ? 'active dot' : 'dot'} key={index} />
              )
            })
          }
        </div>
      </div>
    )
  }
}

Slider.defaultProps = {
  recommends: {},
  loop: true,
  autoPlay: true,
  interval: 4000
}

Slider.propTypes = {
  recommends: PropTypes.array,
  loop: PropTypes.bool,
  interval: PropTypes.number,
  autoPlay: PropTypes.bool
}
export default Slider
