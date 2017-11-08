import React from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import './index.styl'
class Scroll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.scroll = {}
  }
  _initScroll () {
    if (!this.refs.wrapper) {
      return
    }
    console.log(this.props.probeType)
    this.scroll = new BScroll(this.refs.wrapper, {
      probeType: this.props.probeType,
      click: this.props.click
    })

    // 派发监听滚动位置事件
    if (this.props.listenScroll) {
      let { onScroll } = this.props
      this.scroll.on('scroll', (pos) => {
        // 向父组件传值
        console.log(pos, '11111')
        onScroll(pos)
      })
    }

    // 派发上拉刷新时间
    if (this.pullup) {
      this.scroll.on('scrollEnd', () => {
        if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
          // 滑动到底部了
          this.props.onScrollEnd()
        }
      })
    }

    // 滚动前是否触发事件
    if (this.beforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
      })
    }
  }
  enable () {
    this.scroll && this.scroll.enable()
  }
  disable () {
    this.scroll && this.scroll.disable()
  }
  destroy () {
    this.scroll && this.scroll.destroy()
  }
  refresh () {
    this.scroll && this.scroll.refresh()
  }
  scrollTo () {
    setTimeout(() => {
      let { scrollToCallback } = this.props
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      scrollToCallback && scrollToCallback()
    }, 20)
  }
  scrollToElement () {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }
  // componentWillReceiveProps (nextProps) {
  //   let {scrollX, scrollY} = nextProps
  //   this.scrollTo(scrollX || 0, scrollY || 0, 0, 'easing')
  // }
  componentDidMount () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
  componentWillMount () {

  }
  componentWillUpdate () {
    setTimeout(() => {
      this.refresh()
    }, 200)
  }
  render () {
    return (
      <div ref='wrapper' className={this.props.classNames}>{this.props.children}</div>
    )
  }
}
Scroll.defaultProps = {
  probeType: 1,
  click: true,
  listenScroll: false
}

Scroll.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.string,
  probeType: PropTypes.number,
  click: PropTypes.bool,
  scrollToCallback: PropTypes.func,
  onScrollEnd: PropTypes.func,
  onScroll: PropTypes.func,
  listenScroll: PropTypes.bool
}
export default Scroll
