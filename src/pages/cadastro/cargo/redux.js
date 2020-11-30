import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   cargoInit: null,
   cargoSuccess: ['dados'],
   cargoPesquisar: ['cargo'],
   cargoFailure: ['message'],
   cargoCleanMessage: null,
   cargoSalvar: ['obj'],
   cargoSetStateView: ['stateView'],
   cargoSetCargo: ['cargo'],
   cargoCleanTable: null,
});

export const CargoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    cargo: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                 get(dados, ['list'], get(state.data, ['list'], [])),
    message:              get(dados, ['message'], get(state.data, ['message'], [])),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const cleanTable = (state) => state.merge({data: {...state.data, list: []}})

export const setStateView = (state, action) => state.merge({stateView: action.stateView})
export const setCargo = (state, { cargo }) => state.merge({cargo})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CARGO_INIT]               : request,
  [Types.CARGO_SUCCESS]            : success,
  [Types.CARGO_PESQUISAR]          : request,
  [Types.CARGO_FAILURE]            : failure,
  [Types.CARGO_CLEAN_MESSAGE]      : cleanMessage,
  [Types.CARGO_SALVAR]             : request,
  [Types.CARGO_SET_STATE_VIEW]     : setStateView,
  [Types.CARGO_SET_CARGO]          : setCargo,
  [Types.CARGO_CLEAN_TABLE]        : cleanTable,
})
