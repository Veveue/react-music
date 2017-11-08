import React from 'react'
import {NavLink} from 'react-router-dom'
import './index.styl'
class Tab extends React.Component {
  render () {
    return (
      <div className='tab'>
        <NavLink className='tab-item' activeClassName='router-link-active' to='/recommend'><span className='tab-link'>推荐</span></NavLink>
        <NavLink className='tab-item' activeClassName='router-link-active' to='/singer'><span className='tab-link'>歌手</span></NavLink>
        <NavLink className='tab-item' activeClassName='router-link-active' to='/rank'><span className='tab-link'>排行</span></NavLink>
        <NavLink className='tab-item' activeClassName='router-link-active' to='/search'><span className='tab-link'>搜索</span></NavLink>
      </div>
    )
  }
}

export default Tab
