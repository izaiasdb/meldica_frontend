import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   formaPagamentoInit: null,
   formaPagamentoSuccess: ['dados'],
   formaPagamentoPesquisar: ['formaPagamento'],
   formaPagamentoFailure: ['message'],
   formaPagamentoCleanMessage: null,
   formaPagamentoSalvar: ['obj'],
   formaPagamentoSetStateView: ['stateView'],
   formaPagamentoSetFormaPagamento: ['formaPagamento'],
   formaPagamentoCleanTable: null,
});

export const FormaPagamentoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    formaPagamento: null
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
export const setFormaPagamento = (state, { formaPagamento }) => state.merge({formaPagamento})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FORMA_PAGAMENTO_INIT]               : request,
  [Types.FORMA_PAGAMENTO_SUCCESS]            : success,
  [Types.FORMA_PAGAMENTO_PESQUISAR]          : request,
  [Types.FORMA_PAGAMENTO_FAILURE]            : failure,
  [Types.FORMA_PAGAMENTO_CLEAN_MESSAGE]      : cleanMessage,
  [Types.FORMA_PAGAMENTO_SALVAR]             : request,
  [Types.FORMA_PAGAMENTO_SET_STATE_VIEW]     : setStateView,
  [Types.FORMA_PAGAMENTO_SET_FORMA_PAGAMENTO] : setFormaPagamento,
  [Types.FORMA_PAGAMENTO_CLEAN_TABLE]        : cleanTable,
})
