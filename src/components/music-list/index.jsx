/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import SongList from '../song-list'
import { connect } from 'react-redux'
import Loading from '../loading'
import {prefixStyle} from 'common/js/dom'
// import {playlistMixin} from 'common/js/mixin'
import './index.styl'
import {selectPlay, randomPlay} from '../../redux/actions'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

class MusicList extends React.Component {
  constructor (props) {
    super(props)
    this.statec = {
      scrollY: 0,
      minTransalteY: 0
    }
    this.state = {
    }
  }
  back = () => {
    history.go(-1)
  }
  scroll = (pos) => {
    this.scrollY(pos.y)
  }
  selectItem = (v, i) => {
    this.props.dispatch(selectPlay(this.props.songs, i))
  }
  randomPlays () {
    this.props.dispatch(randomPlay(this.props.songs))
  }
  scrollY (newVal) {
    let translateY = Math.max(this.statec.minTransalteY, newVal)
    let scale = 1
    let zIndex = 0
    let blur = 0
    const percent = Math.abs(newVal / this.imageHeight)
    if (newVal > 0) {
      scale = 1 + percent
      zIndex = 10
    } else {
      blur = Math.min(20, percent * 20)
    }
    this.refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
    this.refs.filter.style[backdrop] = `blur(${blur}px)`
    if (newVal < this.statec.minTransalteY) {
      zIndex = 10
      this.refs.bgImage.style.paddingTop = 0
      this.refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      this.refs.playBtn.style.display = 'none'
    } else {
      this.refs.bgImage.style.paddingTop = '70%'
      this.refs.bgImage.style.height = 0
      this.refs.playBtn.style.display = ''
    }
    this.refs.bgImage.style[transform] = `scale(${scale})`
    this.refs.bgImage.style.zIndex = zIndex
  }
  componentDidMount () {
    this.imageHeight = this.refs.bgImage.clientHeight
    this.statec.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.refs.list.refs.wrapper.style.top = `${this.imageHeight}px`
  }
  render () {
    const {title, bgImage, songs} = this.props
    return (
      <div className='music-list'>
        <div className='back' onClick={this.back}>
          <i className='icon-back' />
        </div>
        <h1 className='title'>{title}</h1>
        <div className='bg-image' ref='bgImage' style={{backgroundImage: `url(${bgImage})`}}>
          <div className='play-wrapper'>
            <div ref='playBtn' style={{display: songs.length > 0 ? '' : 'none'}} className='play' onClick={() => { this.randomPlays() }}>
              <i className='icon-play' />
              <span className='text'>随机播放全部</span>
            </div>
          </div>
          <div className='filter' ref='filter' />
        </div>
        <div className='bg-layer' ref='layer' />
        <Scroll ref='list' probeType={3} classNames={'list'} onScroll={this.scroll} listenScroll>
          <div className='song-list-wrapper'>
            <SongList rank={this.props.rank} songs={songs} select={this.selectItem} />
          </div>
          <div className='loading-container' style={{display: songs.length ? 'none' : ''}}>
            <Loading />
          </div>
        </Scroll>
      </div>
    )
  }
}

MusicList.defaultProps = {
  rank: false
}

MusicList.propTypes = {
  songs: PropTypes.array,
  title: PropTypes.string,
  rank: PropTypes.bool,
  bgImage: PropTypes.string,
  dispatch: PropTypes.func
}
export default connect(
  (state) => {
    return {
      list: state.topList.songs
    }
  }
)(MusicList)
