import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   tabelaPrecoInit: null,
   tabelaPrecoSuccess: ['dados'],
   tabelaPrecoPesquisar: ['tabelaPreco'],
   tabelaPrecoFailure: ['message'],
   tabelaPrecoCleanMessage: null,
   tabelaPrecoSalvar: ['obj'],
   tabelaPrecoSetStateView: ['stateView'],
   tabelaPrecoSetTabelaPreco: ['tabelaPreco'],
   tabelaPrecoCleanTable: null,
   tabelaPrecoSetTabelaPrecoItems: ['tabelaPrecoItems'],
   tabelaPrecoPesquisarProduto: ['obj'],
});

export const TabelaPrecoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    tabelaPreco: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    produtoList:           get(dados, ['produtoList'], get(state.data, ['produtoList'], [])),
    message:               get(dados, ['message'], get(state.data, ['message'], [])),
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
export const setTabelaPreco = (state, { tabelaPreco }) => state.merge({tabelaPreco})

export const setTabelaPrecoItems = (state, { tabelaPrecoItems }) => state.merge({
  tabelaPreco: {
    ...state.tabelaPreco,
    tabelaPrecoItems
  }  
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TABELA_PRECO_INIT]              : request,
  [Types.TABELA_PRECO_SUCCESS]           : success,
  [Types.TABELA_PRECO_PESQUISAR]         : request,
  [Types.TABELA_PRECO_FAILURE]           : failure,
  [Types.TABELA_PRECO_CLEAN_MESSAGE]     : cleanMessage,
  [Types.TABELA_PRECO_SALVAR]            : request,
  [Types.TABELA_PRECO_SET_STATE_VIEW]         : setStateView,
  [Types.TABELA_PRECO_SET_TABELA_PRECO]       : setTabelaPreco,
  [Types.TABELA_PRECO_CLEAN_TABLE]            : cleanTable,
  [Types.TABELA_PRECO_SET_TABELA_PRECO_ITEMS] : setTabelaPrecoItems,
  [Types.TABELA_PRECO_PESQUISAR_PRODUTO] : request,
})
