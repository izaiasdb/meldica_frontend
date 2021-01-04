import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"

import { SEARCHING } from '../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   configuracaoInit: null,
   configuracaoSuccess: ['dados'],
   configuracaoPesquisar: ['configuracao'],
   configuracaoFailure: ['message'],
   configuracaoCleanMessage: null,
   configuracaoSalvar: ['obj'],
   configuracaoSetStateView: ['stateView'],
   configuracaoSetConfiguracao: ['configuracao'],
   configuracaoCleanTable: null,
});

export const ConfiguracaoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    configuracao: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:            get(dados, ['list'], get(state.data, ['list'], [])),
    message:         get(dados, ['message'], get(state.data, ['message'], [])),
    planoContaList:  get(dados, ['planoContaList'], get(state.data, ['planoContaList'], [])),
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
export const setConfiguracao = (state, { configuracao }) => state.merge({configuracao})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONFIGURACAO_INIT]             : request,
  [Types.CONFIGURACAO_SUCCESS]          : success,
  [Types.CONFIGURACAO_PESQUISAR]        : request,
  [Types.CONFIGURACAO_FAILURE]          : failure,
  [Types.CONFIGURACAO_CLEAN_MESSAGE]    : cleanMessage,
  [Types.CONFIGURACAO_SALVAR]           : request,
  [Types.CONFIGURACAO_SET_STATE_VIEW]   : setStateView,
  [Types.CONFIGURACAO_SET_CONFIGURACAO] : setConfiguracao,
  [Types.CONFIGURACAO_CLEAN_TABLE]      : cleanTable,
})
