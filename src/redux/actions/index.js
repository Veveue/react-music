import * as types from '../constants/ActionTypes'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const increment = () => ({type: types.INCREMENT})

export const setSinger = (singer) => ({type: types.SET_SINGER, singer})
export const setTopList = (topList) => ({type: types.SET_TOP_LIST, topList})

export const selectPlay = (playlist, index) => (dispatch) => {
  let fs = true
  dispatch({type: types.SET_FAVORITE_LIST, playlist})
  dispatch({type: types.SET_SEQUENCE_LIST, playlist})
  dispatch({type: types.SET_PLAYLIST, playlist})
  dispatch({type: types.SET_CURRENT_INDEX, index})
  dispatch({type: types.SET_FULL_SCREEN, fs})
  dispatch({type: types.SET_PLAYING_STATE, fs})
}
export const randomPlay = (playlist) => (dispatch) => {
  let fs = true
  let mode = playMode.random
  let index = 0
  dispatch({type: types.SET_PLAY_MODE, mode})
  dispatch({type: types.SET_SEQUENCE_LIST, playlist})
  playlist = shuffle(playlist)
  dispatch({type: types.SET_PLAYLIST, playlist})
  dispatch({type: types.SET_CURRENT_INDEX, index})
  dispatch({type: types.SET_FULL_SCREEN, fs})
  dispatch({type: types.SET_PLAYING_STATE, fs})
}
