import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
// import middlewares from './middlewares'
// import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
export default function configureStore (initialState) {
  let store = createStore(rootReducer, initialState, applyMiddleware(thunk))

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    store = createStore(rootReducer, initialState, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__()))
  }
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
