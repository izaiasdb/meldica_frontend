import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   formaCondicaoPagamentoInit: null,
   formaCondicaoPagamentoSuccess: ['dados'],
   formaCondicaoPagamentoPesquisar: ['formaCondicaoPagamento'],
   formaCondicaoPagamentoFailure: ['message'],
   formaCondicaoPagamentoCleanMessage: null,
   formaCondicaoPagamentoSalvar: ['obj'],
   formaCondicaoPagamentoCancelar: ['obj'],
   formaCondicaoPagamentoSetStateView: ['stateView'],
   formaCondicaoPagamentoSetFormaCondicaoPagamento: ['formaCondicaoPagamento'],
   formaCondicaoPagamentoCleanTable: null,
});

export const FormaCondicaoPagamentoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    formaCondicaoPagamento: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                   get(dados, ['list'], get(state.data, ['list'], [])),
    message:                get(dados, ['message'], get(state.data, ['message'], [])),
    condicaoPagamentoList:  get(dados, ['condicaoPagamentoList'], get(state.data, ['condicaoPagamentoList'], [])),
    formaPagamentoList:     get(dados, ['formaPagamentoList'], get(state.data, ['formaPagamentoList'], [])),
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
export const setFormaCondicaoPagamento = (state, { formaCondicaoPagamento }) => state.merge({formaCondicaoPagamento})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FORMA_CONDICAO_PAGAMENTO_INIT]                         : request,
  [Types.FORMA_CONDICAO_PAGAMENTO_SUCCESS]                      : success,
  [Types.FORMA_CONDICAO_PAGAMENTO_PESQUISAR]                    : request,
  [Types.FORMA_CONDICAO_PAGAMENTO_FAILURE]                      : failure,
  [Types.FORMA_CONDICAO_PAGAMENTO_CLEAN_MESSAGE]                : cleanMessage,
  [Types.FORMA_CONDICAO_PAGAMENTO_SALVAR]                       : request,
  [Types.FORMA_CONDICAO_PAGAMENTO_CANCELAR]                     : request,
  [Types.FORMA_CONDICAO_PAGAMENTO_SET_STATE_VIEW]               : setStateView,
  [Types.FORMA_CONDICAO_PAGAMENTO_SET_FORMA_CONDICAO_PAGAMENTO] : setFormaCondicaoPagamento,
  [Types.FORMA_CONDICAO_PAGAMENTO_CLEAN_TABLE]                  : cleanTable,
})
