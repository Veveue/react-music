import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import MHeader from 'components/m-header/'
import Tab from 'components/tab/'

const MainView = ({ route }) => (
  <div className='main-view'>
    <MHeader />
    <Tab />
    {renderRoutes(route.childRoutes)}
  </div>
)

MainView.prototype.propTypes = {
  route: PropTypes.object
}

export default MainView
