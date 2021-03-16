import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   condicaoPagamentoInit: null,
   condicaoPagamentoSuccess: ['dados'],
   condicaoPagamentoPesquisar: ['condicaoPagamento'],
   condicaoPagamentoFailure: ['message'],
   condicaoPagamentoCleanMessage: null,
   condicaoPagamentoSalvar: ['obj'],
   condicaoPagamentoCancelar: ['obj'],
   condicaoPagamentoSetStateView: ['stateView'],
   condicaoPagamentoSetCondicaoPagamento: ['condicaoPagamento'],
   condicaoPagamentoCleanTable: null,
});

export const CondicaoPagamentoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    condicaoPagamento: null
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
export const setCondicaoPagamento = (state, { condicaoPagamento }) => state.merge({condicaoPagamento})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONDICAO_PAGAMENTO_INIT]               : request,
  [Types.CONDICAO_PAGAMENTO_SUCCESS]            : success,
  [Types.CONDICAO_PAGAMENTO_PESQUISAR]          : request,
  [Types.CONDICAO_PAGAMENTO_FAILURE]            : failure,
  [Types.CONDICAO_PAGAMENTO_CLEAN_MESSAGE]      : cleanMessage,
  [Types.CONDICAO_PAGAMENTO_SALVAR]             : request,
  [Types.CONDICAO_PAGAMENTO_CANCELAR]           : request,
  [Types.CONDICAO_PAGAMENTO_SET_STATE_VIEW]     : setStateView,
  [Types.CONDICAO_PAGAMENTO_SET_CONDICAO_PAGAMENTO] : setCondicaoPagamento,
  [Types.CONDICAO_PAGAMENTO_CLEAN_TABLE]        : cleanTable,
})
