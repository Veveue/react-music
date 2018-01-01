import * as types from '../constants/ActionTypes'
import {playMode} from 'common/js/config'
// import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const initialState = {
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default function selectPlay (state = initialState, action) {
  state.currentSong = state.playlist[state.currentIndex] || {}
  switch (action.type) {
    case types.SET_FAVORITE_LIST:
      return Object.assign({}, state, {playlist: action.playlist})
    case types.SET_SEQUENCE_LIST:
      return Object.assign({}, state, {sequenceList: action.playlist})
    case types.SET_PLAYLIST:
      return Object.assign({}, state, {playlist: action.playlist})
    case types.SET_CURRENT_INDEX:
      return Object.assign({}, state, {currentIndex: action.index})
    case types.SET_FULL_SCREEN:
      return Object.assign({}, state, {fullScreen: action.fs})
    case types.SET_PLAYING_STATE:
      return Object.assign({}, state, {playing: action.fs})
    case types.SET_PLAY_MODE:
      return Object.assign({}, state, {mode: action.mode})
    default:
      return state
  }
}
