import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   fornecedorInit: null,
   fornecedorSuccess: ['dados'],
   fornecedorPesquisar: ['fornecedor'],
   fornecedorFailure: ['message'],
   fornecedorCleanMessage: null,
   fornecedorSalvar: ['obj'],
   fornecedorSetStateView: ['stateView'],
   fornecedorSetFornecedor: ['fornecedor'],
   fornecedorCleanTable: null,
});

export const FornecedorTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    fornecedor: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:               get(dados, ['message'], get(state.data, ['message'], [])),    
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    fornecedorList:           get(dados, ['fornecedorList'], get(state.data, ['fornecedorList'], [])),
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
export const setFornecedor = (state, { fornecedor }) => state.merge({fornecedor})

export const setFornecedorItems = (state, { fornecedorItems }) => state.merge({
  fornecedor: {
    ...state.fornecedor,
    fornecedorItems
  }  
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FORNECEDOR_INIT]              : request,
  [Types.FORNECEDOR_SUCCESS]           : success,
  [Types.FORNECEDOR_PESQUISAR]         : request,
  [Types.FORNECEDOR_FAILURE]           : failure,
  [Types.FORNECEDOR_CLEAN_MESSAGE]     : cleanMessage,
  [Types.FORNECEDOR_SALVAR]            : request,
  [Types.FORNECEDOR_SET_STATE_VIEW]    : setStateView,
  [Types.FORNECEDOR_SET_FORNECEDOR]       : setFornecedor,
  [Types.FORNECEDOR_CLEAN_TABLE]       : cleanTable,
})
