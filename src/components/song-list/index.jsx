import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

class SongList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  selectItem = (v, i) => {
    this.props.select(v, i)
  }
  getRankCls (index) {
    if (index <= 2) {
      return `icon icon${index}`
    } else {
      return 'text'
    }
  }
  componentDidMount () {

  }
  componentWillMount () {

  }
  componentDidUpdate () {
  }
  render () {
    const { songs, rank } = this.props
    let me = this
    return (
      <div className='song-list'>
        <ul>
          {
            songs.map((item, index) => {
              return (
                <li className='item' key={index} onClick={() => { this.selectItem(item, index) }}>
                  <div className='rank' style={{display: rank ? '' : 'none'}}>
                    <span className={me.getRankCls(index)}>{++index}</span>
                  </div>
                  <div className='content'>
                    <h2 className='name'>{item.name}</h2>
                    <p className='desc'>{`${item.singer}·${item.album}`}</p>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

SongList.defaultProps = {
  songs: [],
  rank: false
}

SongList.propTypes = {
  songs: PropTypes.array,
  rank: PropTypes.bool,
  select: PropTypes.func
}
export default SongList
