import React from 'react'
import PropTypes from 'prop-types'
import MusicList from 'components/music-list/'
import { connect } from 'react-redux'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import './index.styl'

class SingerDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      songs: []
    }
  }
  _getDetail () {
    if (!this.props.singer.id) {
      this.props.history.push('/singer')
      return
    }
    getSingerDetail(this.props.singer.id).then((res) => {
      if (res.code === ERR_OK) {
        this.setState({songs: this._normalizeSongs(res.data.list)})
      }
    })
  }
  _normalizeSongs (list) {
    let ret = []
    list.forEach((item) => {
      let {musicData} = item
      if (musicData.songid && musicData.albummid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  componentWillMount () {
    this._getDetail()
  }
  render () {
    let {name, avatar} = this.props.singer
    let flag = false
    let {songs} = this.state
    return (
      <div className='singer-detail' ref='singer' >
        <MusicList rank={flag} title={name} bgImage={avatar} songs={songs} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {singer: state.signer}
}

SingerDetail.propTypes = {
  history: PropTypes.object,
  singer: PropTypes.object
}
export default connect(
  mapStateToProps
)(SingerDetail)
