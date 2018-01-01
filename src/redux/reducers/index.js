import { combineReducers } from 'redux'
import counter from './counter'
import signer from './signer'
import play from './play'
import topList from './topList'

export default combineReducers({
  counter,
  play,
  signer,
  topList
})
