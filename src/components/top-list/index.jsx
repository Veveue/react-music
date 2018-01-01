import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { connect } from 'react-redux'
import MusicList from '../music-list'
import {createSong} from 'common/js/song'
class TopList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      topList: this.props.topList,
      songs: [],
      rank: true
    }
  }
  _getMusicList () {
    if (!this.state.topList.id) {
      this.props.history.push('/rank')
    }
    getMusicList(this.state.topList.id).then((res) => {
      if (res.code === ERR_OK) {
        this.setState({songs: this._normalizeSongs(res.songlist)})
      }
    })
  }
  _normalizeSongs (list) {
    let ret = []
    list.forEach((item) => {
      const musicData = item.data
      if (musicData.songid && musicData.albummid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  componentWillMount () {
    this._getMusicList()
  }
  render () {
    return (
      <div className='singer-detail' ref='singer' >
        <MusicList rank title={this.state.topList.topTitle} bgImage={this.state.topList.picUrl} songs={this.state.songs} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {topList: state.topList}
}

TopList.propTypes = {
  history: PropTypes.object,
  topList: PropTypes.object
}
export default connect(
  mapStateToProps
)(TopList)
