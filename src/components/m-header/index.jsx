import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './index.styl'
const Mheader = ({msg}) => (
  <div className='m-header'>
    <div className='icon' />
    <h1 className='text'>Chicken Music</h1>
    <Link to='/user' className='mine'><i className='icon-mine' /></Link>
  </div>
)

Mheader.prototype.propTypes = {
  msg: PropTypes.string
}

export default Mheader
