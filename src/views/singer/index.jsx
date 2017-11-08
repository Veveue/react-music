import React from 'react'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import './index.styl'
import ListView from 'components/listview/'

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
        console.log(this.state.singers)
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
    // 为了得到有序列表，我们需要处理 map
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
  componentWillMount () {
    this._getSingerList()
  }
  render () {
    return (
      <div className='singer' ref='singer'>
        <ListView ref='list' data={this.state.singers} />
      </div>
    )
  }
}
export default Signer
