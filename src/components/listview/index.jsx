import React from 'react'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import {getData} from 'common/js/dom'
import './index.styl'

const ANCHOR_HEIGHT = 18
var listHeight = []
function _calculateHeight () {
  listHeight = []
  const list = document.querySelectorAll('.list-group')
  let height = 0
  listHeight.push(height)
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    height += item.clientHeight
    listHeight.push(height)
  }
}

class ListView extends React.Component {
  constructor (props) {
    super(props)
    this.statec = {
      scrollY: -1,
      diff: -1,
      touch: {}
    }
    this.state = {
      currentIndex: 0,
      fixedTitle: '',
      refreshScroll: false
    }
  }
  fixedTitle () {
    if (this.statec.scrollY > 0) {
      return ''
    }
    return this.props.data[this.state.currentIndex] ? this.props.data[this.state.currentIndex].title : ''
  }
  shortcutList () {
    return this.props.data.map((group) => {
      return group.title.substr(0, 1)
    })
  }
  _scrollTo (index) {
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index > listHeight.length - 2) {
      index = listHeight.length - 2
    }
    this.statec.scrollY = -listHeight[index]
    this.refs.listview.scrollToElement(document.querySelectorAll('.list-group')[index], 0)
  }
  onShortcutTouchStart () {
    let anchorIndex = getData(event.target, 'index')
    let firstTouch = event.touches[0]
    this.statec.touch.y1 = firstTouch.pageY
    this.statec.touch.anchorIndex = anchorIndex
    console.log(this.statec.touch)

    this._scrollTo(anchorIndex)
    this.scrollY()
  }
  onShortcutTouchMove () {
    event.preventDefault()
    let firstTouch = event.touches[0]
    this.statec.touch.y2 = firstTouch.pageY
    let delta = (this.statec.touch.y2 - this.statec.touch.y1) / ANCHOR_HEIGHT | 0
    let anchorIndex = parseInt(this.statec.touch.anchorIndex) + delta
    this._scrollTo(anchorIndex)
    this.scrollY()
  }
  scrollY () {
    if (this.statec.scrollY > 0) {
      return
    }
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (-this.statec.scrollY >= height1 && -this.statec.scrollY < height2) {
        this.statec.diff = height2 + this.statec.scrollY
        // console.log(this.statec.diff, i)
        this.setState({ currentIndex: i })
        return
      } else {
      }
    }
    // this.setState({ currentIndex: listHeight.length - 2 })
  }
  scroll = (pos) => {
    this.statec.scrollY = pos.y
    this.scrollY()
  }
  selectItem = (c) => {
    this.props.select(c)
  }
  componentDidMount () {
    this.refs.shortcut.addEventListener('touchstart', () => {
      this.onShortcutTouchStart()
    })
    this.refs.shortcut.addEventListener('touchmove', () => {
      this.onShortcutTouchMove()
    })
  }
  componentWillMount () {

  }
  componentDidUpdate () {
    _calculateHeight()
  }
  componentWillUnmount () {
    this.statec = {
      scrollY: -1,
      diff: -1,
      touch: {}
    }
  }
  render () {
    const {data} = this.props
    const shortcutList = this.shortcutList()
    const fixedTitle = this.fixedTitle()
    const currentIndex = this.state.currentIndex
    const me = this
    return (
      <Scroll ref='listview' probeType={3} classNames={'listview'} refresh={this.state.refreshScroll} onScroll={this.scroll} listenScroll>
        <ul>
          {
            data.map(function (item, index) {
              return (
                <li className='list-group' ref='listGroup' key={index} data-s={Math.random()}>
                  <h2 className='list-group-title'>{item.title}</h2>
                  {
                    item.items.map(function (list, key) {
                      return (<ul key={key}>
                        <li className='list-group-item' onClick={() => me.selectItem(list)}>
                          <img className='avatar' src={list.avatar} />
                          <span className='name'>{list.name}</span>
                        </li>
                      </ul>)
                    })
                  }
                </li>
              )
            })
          }
        </ul>

        <div className='list-shortcut' ref='shortcut'>
          <ul>
            {
              shortcutList.map(function (item, index) {
                return (<li key={index} data-index={index} className={index === currentIndex ? 'current item' : 'item'}>{item}</li>)
              })
            }
          </ul>
        </div>
        <div className='list-fixed' ref='fixed'>
          <div className='fixed-title'>{fixedTitle}</div>
        </div>
      </Scroll>
    )
  }
}

ListView.defaultProps = {
  data: []
}

ListView.propTypes = {
  data: PropTypes.array,
  select: PropTypes.func
}
export default ListView
