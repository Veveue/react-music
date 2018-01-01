import {SET_SINGER} from '../constants/ActionTypes'
// import {playMode} from 'common/js/config'
// import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const initialState = {
  singer: {}
}

export default function signer (state = initialState, action) {
  switch (action.type) {
    case SET_SINGER:
      return action.singer
    default:
      return state
  }
}
