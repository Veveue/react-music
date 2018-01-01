import {SET_TOP_LIST} from '../constants/ActionTypes'
// import {playMode} from 'common/js/config'
// import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const initialState = {
  singer: {}
}

export default function topList (state = initialState, action) {
  switch (action.type) {
    case SET_TOP_LIST:
      return action.topList
    default:
      return state
  }
}
