import React from 'react'
import PropTypes from 'prop-types'
import {getSingerList} from 'api/singer'
import { renderRoutes } from 'react-router-config'
import {ERR_OK} from 'api/config'
import { connect } from 'react-redux'
import Singer from 'common/js/singer'
import './index.styl'
import ListView from 'components/listview/'

import { setSinger } from '../../redux/actions'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
class Signer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recommends: [],
      singers: []
    }
  }
  _getSingerList () {
    getSingerList().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({
          singers: this._normalizeSinger(res.data.list)
        })
      }
    })
  }
  _normalizeSinger (list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        map.hot.items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new Singer({
        name: item.Fsinger_name,
        id: item.Fsinger_mid
      }))
    })
    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
  selectSinger =(singer) => {
    this.props.dispatch(setSinger(singer))
    this.props.history.push('/singer/' + singer.id)
  }
  componentWillMount () {
    this._getSingerList()
  }
  render () {
    return (
      <div className='singer' ref='singer'>
        <ListView ref='list' data={this.state.singers} select={this.selectSinger} />
        {renderRoutes(this.props.route.childRoutes)}
      </div>
    )
  }
}

Signer.propTypes = {
  history: PropTypes.object,
  route: PropTypes.object,
  dispatch: PropTypes.func
}
export default connect(
  (state) => {
    return {
      singer: state.singers
    }
  }
)(Signer)
