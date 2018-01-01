import React from 'react'
import PropTypes from 'prop-types'
import Scroll from 'components/scroll/'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import './index.styl'
import {setTopList} from '../../redux/actions'
class Rank extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      topList: []
    }
  }
  _getTopList () {
    getTopList().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({topList: res.data.topList})
      }
    })
  }
  selectItem (item) {
    console.log(item)
    this.props.history.push(`/rank/${item.id}`)
    this.props.dispatch(setTopList(item))
  }
  componentWillMount () {
    this._getTopList()
  }
  render () {
    let topList = this.state.topList
    return (
      <div className='ranks' ref='rank'>
        <Scroll classNames={'toplist'}>
          <div>
            <ul>
              {
                topList.map((item, index) => {
                  return (
                    <li className='item' key={index} onClick={() => this.selectItem(item)}>
                      <div className='icon'>
                        <img width='100' height='100' src={item.picUrl} />
                      </div>
                      <ul className='songlist'>
                        {
                          item.songList.map(function (song, index2) {
                            return (
                              <li className='song' key={index2}>
                                <span>{index2 + 1} </span>
                                <span>{song.songname} - {song.singername}</span>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  )
                })
              }

            </ul>
            <div className='loading-container' />
          </div>
        </Scroll>
        {renderRoutes(this.props.route.childRoutes)}
      </div>
    )
  }
}
Rank.propTypes = {
  history: PropTypes.object,
  route: PropTypes.object,
  dispatch: PropTypes.func
}
export default connect(
  (state) => {
    return {
      topList: state.topList
    }
  }
)(Rank)
