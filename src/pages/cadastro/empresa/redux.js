import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   empresaInit: null,
   empresaSuccess: ['dados'],
   empresaPesquisar: ['empresa'],
   empresaFailure: ['message'],
   empresaCleanMessage: null,
   empresaSalvar: ['obj'],
   empresaSetStateView: ['stateView'],
   empresaSetEmpresa: ['empresa'],
   empresaCleanTable: null,
});

export const EmpresaTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    empresa: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:               get(dados, ['message'], get(state.data, ['message'], [])),    
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    empresaList:           get(dados, ['empresaList'], get(state.data, ['empresaList'], [])),
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
export const setEmpresa = (state, { empresa }) => state.merge({empresa})

export const setEmpresaItems = (state, { empresaItems }) => state.merge({
  empresa: {
    ...state.empresa,
    empresaItems
  }  
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.EMPRESA_INIT]              : request,
  [Types.EMPRESA_SUCCESS]           : success,
  [Types.EMPRESA_PESQUISAR]         : request,
  [Types.EMPRESA_FAILURE]           : failure,
  [Types.EMPRESA_CLEAN_MESSAGE]     : cleanMessage,
  [Types.EMPRESA_SALVAR]            : request,
  [Types.EMPRESA_SET_STATE_VIEW]    : setStateView,
  [Types.EMPRESA_SET_EMPRESA]       : setEmpresa,
  [Types.EMPRESA_CLEAN_TABLE]       : cleanTable,
})
