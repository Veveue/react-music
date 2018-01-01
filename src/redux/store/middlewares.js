import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const middleware = [ thunk ]
export default applyMiddleware(
  // you can apply you middleware here

  applyMiddleware(...middleware)
)
