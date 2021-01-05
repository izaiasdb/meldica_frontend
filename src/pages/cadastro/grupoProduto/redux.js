import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   grupoProdutoInit: null,
   grupoProdutoSuccess: ['dados'],
   grupoProdutoPesquisar: ['grupoProduto'],
   grupoProdutoFailure: ['message'],
   grupoProdutoCleanMessage: null,
   grupoProdutoSalvar: ['obj'],
   grupoProdutoSetStateView: ['stateView'],
   grupoProdutoSetGrupoProduto: ['grupoProduto'],
   grupoProdutoCleanTable: null,
});

export const GrupoProdutoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    grupoProduto: null
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
export const setGrupoProduto = (state, { grupoProduto }) => state.merge({grupoProduto})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GRUPO_PRODUTO_INIT]               : request,
  [Types.GRUPO_PRODUTO_SUCCESS]            : success,
  [Types.GRUPO_PRODUTO_PESQUISAR]          : request,
  [Types.GRUPO_PRODUTO_FAILURE]            : failure,
  [Types.GRUPO_PRODUTO_CLEAN_MESSAGE]      : cleanMessage,
  [Types.GRUPO_PRODUTO_SALVAR]             : request,
  [Types.GRUPO_PRODUTO_SET_STATE_VIEW]     : setStateView,
  [Types.GRUPO_PRODUTO_SET_GRUPO_PRODUTO] : setGrupoProduto,
  [Types.GRUPO_PRODUTO_CLEAN_TABLE]        : cleanTable,
})
