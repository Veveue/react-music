/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProgressBar from '../progress-bar'
import ProgressCircle from '../progress-circle'
import Scroll from '../scroll'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import {playMode} from 'common/js/config'
import './index.styl'
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
class Player extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      playingLyric: null,
      refreshScroll: false,
      currentShow: 'cd'
    }
    this.touch = {}
    this.currentLineNum = 0
  }
  back () {
    this.setFull(false)
  }
  open () {
    event.stopPropagation()
    this.setFull(true)
  }
  ready () {
    this.setState({songReady: true})
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
    }
    this.getLyric()
  }
  error () {
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
    }
    this.setState({songReady: true})
  }
  updateTime (e) {
    this.setState({currentTime: e.target.currentTime})
  }
  _pad (num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  }
  format (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  }
  end () {
    if (this.props.stores.play.mode === playMode.loop) {
      this.loop()
    } else {
      this.next()
    }
  }
  loop () {
    this.refs.audio.currentTime = 0
    this.refs.audio.play()
    let fs = true
    this.props.dispatch({type: 'SET_PLAYING_STATE', fs})

    if (this.state.currentLyric) {
      this.state.currentLyric.seek(0)
    }
  }
  next () {
    if (!this.state.songReady) return
    let index = this.props.stores.play.currentIndex + 1
    if (index === this.props.stores.play.playlist.length) {
      index = 0
    }
    this.props.dispatch({type: 'SET_CURRENT_INDEX', index})
    if (!this.props.stores.play.playing) {
      this.togglePlaying(event)
    }
    this.setState({songReady: true})
  }
  prev () {
    if (!this.state.songReady) return
    let index = this.props.stores.play.currentIndex - 1
    if (index === -1) {
      index = this.props.stores.play.playlist.length - 1
    }
    this.props.dispatch({type: 'SET_CURRENT_INDEX', index})
    if (!this.props.stores.play.playing) {
      this.togglePlaying(event)
    }
    this.setState({songReady: true})
  }
  setFull (fs) {
    this.props.dispatch({type: 'SET_FULL_SCREEN', fs})
  }
  onProgressBarChange = (percent) => {
    const currentTime = this.props.stores.play.currentSong.duration * percent
    this.refs.audio.currentTime = currentTime
    if (!this.props.stores.play.playing) {
      this.togglePlaying(event)
    }

    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
  }
  togglePlaying (e) {
    e.stopPropagation()
    if (!this.state.songReady) {
      return
    }
    let fs = !this.props.stores.play.playing
    this.props.dispatch({type: 'SET_PLAYING_STATE', fs})
    if (this.state.currentLyric) {
      this.state.currentLyric.togglePlay()
    }
  }
  changeMode () {
    const mode = (this.props.stores.play.mode + 1) % 3
    this.props.dispatch({type: 'SET_PLAY_MODE', mode})
    let playlist = null
    if (mode === playMode.random) {
      playlist = shuffle(this.props.stores.play.sequenceList)
    } else {
      playlist = this.props.stores.play.sequenceList
    }
    this.props.dispatch({type: 'SET_PLAYLIST', playlist})
    this.resetCurrentIndex(playlist)
  }
  resetCurrentIndex (list) {
    let index = list.findIndex((item) => {
      return item.id === this.props.stores.play.currentSong.id
    })
    this.props.dispatch({type: 'SET_CURRENT_INDEX', index})
  }
  getLyric () {
    this.props.stores.play.currentSong.getLyric().then((lyric) => {
      // if (this.props.stores.play.currentSong.lyric !== lyric) {
      //   return
      // }
      this.state.currentLyric = new Lyric(lyric, this.handleLyric)
      if (this.props.stores.play.playing) {
        this.state.currentLyric.play()
      }
    }).catch(() => {
      this.state.playingLyric = null
      this.state.currentLyric = null
    })
  }
  handleLyric = ({lineNum, txt}) => {
    this.currentLineNum = lineNum
    if (lineNum > 5) {
      let lineEl = document.getElementsByClassName('lyricLine')[lineNum - 5]
      this.refs.lyricList.scrollToElement(lineEl, 1000)
    } else {
      this.refs.lyricList.scrollTo(0, 0, 1000)
    }
    this.state.playingLyric = txt
  }
  componentWillUpdate () {
    if (this.refs.audio.readyState) {
      this.props.stores.play.playing ? this.refs.audio.play() : this.refs.audio.pause()
    }
  }
  iconMode () {
    return this.props.stores.play.mode === playMode.sequence ? 'icon-sequence' : this.props.stores.play.mode === playMode.loop ? 'icon-loop' : 'icon-random'
  }
  middleTouchStart (e) {
    this.touch.initiated = true
    const touch = e.touches[0]
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }

  middleTouchMove (e) {
    if (!this.touch.initiated) {
      return
    }
    const touch = e.touches[0]
    const deltaX = touch.pageX - this.touch.startX
    const deltaY = touch.pageY - this.touch.startY
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return
    }
    const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
    document.getElementsByClassName('middle-r')[0].style[transform] = `translate3d(${offsetWidth}px,0,0)`
    document.getElementsByClassName('middle-r')[0].style[transitionDuration] = 0
    this.refs.middleL.style.opacity = 1 - this.touch.percent
    this.refs.middleL.style[transitionDuration] = 0
  }
  middleTouchEnd () {
    let offsetWidth
    let opacity
    if (this.state.currentShow === 'cd') {
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        this.state.currentShow = 'lyric'
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      if (this.touch.percent < 0.9) {
        offsetWidth = 0
        this.state.currentShow = 'cd'
        opacity = 1
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }
    const time = 300

    document.getElementsByClassName('middle-r')[0].style[transform] = `translate3d(${offsetWidth}px,0,0)`
    document.getElementsByClassName('middle-r')[0].style[transitionDuration] = `${time}ms`
    this.refs.middleL.style.opacity = opacity
    this.refs.middleL.style[transitionDuration] = `${time}ms`
    this.touch.initiated = false
  }

  lyricWarper () {
    let currentLyric = this.state.currentLyric

    if (!this.state.currentLyric) {
      return (
        <div className='middle-r'><i>暂无歌词</i></div>
      )
    }
    return (
      <Scroll ref='lyricList' probeType={3} classNames={'middle-r'} refresh={this.state.refreshScroll}>
        <div className='lyric-wrapper'>
          <div>
            {
              currentLyric.lines.map((line, index) => {
                return (<p ref='lyricLine' key={index} className={this.currentLineNum === index ? 'lyricLine text current' : 'lyricLine text'}>{line.txt}</p>
                )
              })
            }
          </div>
        </div>
      </Scroll>
    )
  }
  render () {
    let state = this.props.stores
    let playlist = state.play.playlist
    let fullScreen = state.play.fullScreen
    let playing = state.play.playing
    let currentSong = state.play.currentSong
    let currentIndex = state.play.currentIndex
    return (
      <div className='player' style={{display: playlist.length ? '' : 'none'}}>
        <div className='normal-player' style={{display: fullScreen ? '' : 'none'}}>
          <div className='background'>
            <img width='100%' height='100%' src={currentSong.image} />
          </div>
          <div className='top'>
            <div className='back' onClick={() => this.back()}>
              <i className='icon-back' />
            </div>
            <h1 className='title' title={currentIndex}>{currentSong.name}</h1>
            <h2 className='subtitle'>{currentSong.singer}</h2>
          </div>
          <div className='middle'
            onTouchStart={(e) => this.middleTouchStart(e)}
            onTouchMove={(e) => this.middleTouchMove(e)}
            onTouchEnd={() => this.middleTouchEnd()}
          >
            <div className='middle-l' ref='middleL'>
              <div className='cd-wrapper' ref='cdWrapper'>
                <div className={playing ? 'cd play' : 'cd play pause'} >
                  <img className='image' src={currentSong.image} />
                </div>
              </div>
              <div className='playing-lyric-wrapper'>
                <div className='playing-lyric'>{this.state.playingLyric}</div>
              </div>
            </div>
            {this.lyricWarper()}
          </div>
          <div className='bottom'>
            <div className='dot-wrapper'>
              <span className={this.state.currentShow === 'cd' ? 'dot active' : 'dot'} />
              <span className={this.state.currentShow === 'lyric' ? 'dot active' : 'dot'} />
            </div>
            <div className='progress-wrapper'>
              <span className='time time-l'>{this.format(this.state.currentTime)}</span>
              <div className='progress-bar-wrapper'>
                <ProgressBar percent={this.state.currentTime / currentSong.duration} percentChange={this.onProgressBarChange} /> </div>
              <span className='time time-r'>{this.format(currentSong.duration)}</span>
            </div>
            <div className='operators'>
              <div className='icon i-left' onClick={() => this.changeMode()}>
                <i className={this.iconMode()} />
              </div>
              <div className='icon i-left'>
                <i className='icon-prev' onClick={() => this.prev()} />
              </div>
              <div className='icon i-center'>
                <i className={playing ? 'icon-pause' : 'icon-play'} onClick={(e) => this.togglePlaying(e)} />
              </div>
              <div className='icon i-right'>
                <i className='icon-next' onClick={() => this.next()} />
              </div>
              <div className='icon i-right'>
                <i className='icon icon-not-favorite' />
              </div>
            </div>
          </div>
        </div>
        <div className='mini-player' style={{display: !fullScreen ? '' : 'none'}} onClick={() => this.open()}>
          <div className='icon'>
            <img width='40' height='40' src={currentSong.image} className={playing ? 'play' : 'play pause'} />
          </div>
          <div className='text'>
            <h2 className='name'>{currentSong.name}</h2>
            <p className='desc'>{currentSong.singer}</p>
          </div>
          <div className='control'>
            <ProgressCircle radius={32} percent={this.state.currentTime / currentSong.duration}>
              <i onClick={(e) => this.togglePlaying(e)} className={playing ? 'icon-mini icon-pause-mini' : 'icon-mini icon-play-mini'} />
            </ProgressCircle>
          </div>
          <div className='control'>
            <i className='icon-playlist' />
          </div>
        </div>
        <audio ref='audio' src={currentSong.url} onCanPlay={() => this.ready()} onError={() => this.error()} onTimeUpdate={(e) => this.updateTime(e)} onEnded={() => this.end()} />
      </div>
    )
  }
}
Player.contextTypes = {
  stores: PropTypes.object
}
export default connect(
  (state) => {
    return {stores: state}
  }
)(Player)
