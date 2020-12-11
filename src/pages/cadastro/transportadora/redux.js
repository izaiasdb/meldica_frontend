import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   transportadoraInit: null,
   transportadoraSuccess: ['dados'],
   transportadoraPesquisar: ['transportadora'],
   transportadoraFailure: ['message'],
   transportadoraCleanMessage: null,
   transportadoraSalvar: ['obj'],
   transportadoraSetStateView: ['stateView'],
   transportadoraSetTransportadora: ['transportadora'],
   transportadoraCleanTable: null,
});

export const TransportadoraTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    transportadora: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:               get(dados, ['message'], get(state.data, ['message'], [])),    
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    transportadoraList:           get(dados, ['transportadoraList'], get(state.data, ['transportadoraList'], [])),
    ufList:                get(dados, ['ufList'], get(state.data, ['ufList'], [])),
    municipioList:         get(dados, ['municipioList'], get(state.data, ['municipioList'], [])),
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
export const setTransportadora = (state, { transportadora }) => state.merge({transportadora})

export const setTransportadoraItems = (state, { transportadoraItems }) => state.merge({
  transportadora: {
    ...state.transportadora,
    transportadoraItems
  }  
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TRANSPORTADORA_INIT]               : request,
  [Types.TRANSPORTADORA_SUCCESS]            : success,
  [Types.TRANSPORTADORA_PESQUISAR]          : request,
  [Types.TRANSPORTADORA_FAILURE]            : failure,
  [Types.TRANSPORTADORA_CLEAN_MESSAGE]      : cleanMessage,
  [Types.TRANSPORTADORA_SALVAR]             : request,
  [Types.TRANSPORTADORA_SET_STATE_VIEW]     : setStateView,
  [Types.TRANSPORTADORA_SET_TRANSPORTADORA] : setTransportadora,
  [Types.TRANSPORTADORA_CLEAN_TABLE]        : cleanTable,
})
