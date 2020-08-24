import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   produtoInit: null,
   produtoSuccess: ['dados'],
   produtoPesquisar: ['produto'],
   produtoFailure: ['message'],
   produtoCleanMessage: null,
   produtoSalvar: ['obj'],
   produtoSetStateView: ['stateView'],
   produtoSetProduto: ['produto'],
   produtoCleanTable: null,
   produtoSetProdutoItems: ['produtoItems'],
   produtoPesquisarProduto: ['obj'],
});

export const ProdutoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    produto: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    produtoList:           get(dados, ['produtoList'], get(state.data, ['produtoList'], [])),
    message:               get(dados, ['message'], get(state.data, ['message'], [])),
    unidadeMedidaList:     get(dados, ['unidadeMedidaList'], get(state.data, ['unidadeMedidaList'], [])),
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
export const setProduto = (state, { produto }) => state.merge({produto})

export const setProdutoItems = (state, { produtoItems }) => state.merge({
  produto: {
    ...state.produto,
    produtoItems
  }  
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUTO_INIT]              : request,
  [Types.PRODUTO_SUCCESS]           : success,
  [Types.PRODUTO_PESQUISAR]         : request,
  [Types.PRODUTO_FAILURE]           : failure,
  [Types.PRODUTO_CLEAN_MESSAGE]     : cleanMessage,
  [Types.PRODUTO_SALVAR]            : request,
  [Types.PRODUTO_SET_STATE_VIEW]    : setStateView,
  [Types.PRODUTO_SET_PRODUTO]       : setProduto,
  [Types.PRODUTO_CLEAN_TABLE]       : cleanTable,
  [Types.PRODUTO_SET_PRODUTO_ITEMS] : setProdutoItems,
  [Types.PRODUTO_PESQUISAR_PRODUTO] : request,
})
