import React from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from 'routes'
// import logo from './assets/logo.svg'

const App = () => (
  <div className='App'>
    <Router>
      {renderRoutes(routes)}
    </Router>
  </div>
)

export default App
