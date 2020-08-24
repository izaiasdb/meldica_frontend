import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   moduloInit: null,
   moduloSuccess: ['dados'],
   moduloPesquisar: ['modulo'],
   moduloFailure: ['message'],
   moduloCleanMessage: null,
   moduloSalvar: ['obj'],
   moduloSetState: ['state'],
   moduloSetModulo: ['modulo'],
   moduloCleanTable: null,
});

export const ModuloTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    state: SEARCHING,
    modulo: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                 get(dados, ['list'], get(state.data, ['list'], [])),
    message:              get(dados, ['message'], get(state.data, ['message'], [])),
    sistemas:             get(dados, ['sistemas'], get(state.data, ['sistemas'], [])),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const cleanTable = (state) => state.merge({data: {...state.data, list: []}})

export const setState = (state, action) => state.merge({state: action.state})
export const setModulo = (state, { modulo }) => state.merge({modulo})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MODULO_INIT]               : request,
  [Types.MODULO_SUCCESS]            : success,
  [Types.MODULO_PESQUISAR]          : request,
  [Types.MODULO_FAILURE]            : failure,
  [Types.MODULO_CLEAN_MESSAGE]      : cleanMessage,
  [Types.MODULO_SALVAR]             : request,
  [Types.MODULO_SET_STATE]          : setState,
  [Types.MODULO_SET_MODULO]         : setModulo,
  [Types.MODULO_CLEAN_TABLE]        : cleanTable,
})
