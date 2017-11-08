import React from 'react'
import {getRecommend, getDiscList} from 'api/recommend'
import Slider from 'components/slider/'
import Scroll from 'components/scroll/'
import {ERR_OK} from 'api/config'
import './index.styl'
class Recommend extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recommends: [],
      discList: []
    }
  }
  componentWillMount () {
    this._getRecommend()
    this._getDiscList()
  }

  _getRecommend () {
    getRecommend().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({recommends: res.data.slider})
      }
    })
  }
  _getDiscList () {
    getDiscList().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({discList: res.data.list})
      }
    })
  }
  slider () {
    if (this.state.recommends.length) {
      return <Slider recommends={this.state.recommends} />
    }
  }
  render () {
    let discList = this.state.discList
    return (
      <div className='recommend' ref='recommend'>
        <Scroll classNames={'recommend-content'}>
          <div>
            <div className='slider-wrapper'>
              <div className='slider-content'>
                {this.slider()}
              </div>
            </div>
            <div className='recommend-list'>
              <h1 className='list-title'>热门歌单推荐</h1>
              <ul>
                {
                  discList.map(function (item, index) {
                    return (
                      <li className='item' key={index}>
                        <div className='icon'>
                          <img width='60' height='60' src={item.imgurl} />
                        </div>
                        <div className='text'>
                          <h2 className='name'>{item.creator.name}</h2>
                          <p className='desc'>{item.dissname}</p>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div></div>
        </Scroll>
      </div>
    )
  }
}
export default Recommend
