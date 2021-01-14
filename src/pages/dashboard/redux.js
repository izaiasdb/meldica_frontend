import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

const { Types, Creators } = createActions({
   dashboardSuccess: ['dados'],
   dashboardFailure: ['message'],
   dashboardCleanMessage: null,
   dashboardCleanMensagemUnidade: null,
   dashboardGetPopulacaoTotal: null,
   dashboardGetTotalColaboradorPorTipo: null,
   dashboardGetPopulacaoTotalPorUnidade: null,
   dashboardSetUnidadeAtual: ['unidadeAtual'],
   dashboardPesquisarMensagemUnidade: ['obj'],
   dashboardPesquisarVenda: ['obj'],
});

export const DashboardTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false
});

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
     populacaoTotal:            get(dados, ['populacaoTotal'], get(state.data, ['populacaoTotal'], [])),
     totalColaboradorPorTipo:   get(dados, ['totalColaboradorPorTipo'], get(state.data, ['totalColaboradorPorTipo'], [])),
     populacaoTotalPorUnidade:  get(dados, ['populacaoTotalPorUnidade'], get(state.data, ['populacaoTotalPorUnidade'], [])),
     unidadeAtual:              get(dados, ['unidadeAtual'], get(state.data, ['unidadeAtual'], {})),
     mensagemUnidade:           get(dados, ['mensagemUnidade'], get(state.data, ['mensagemUnidade'], {})),
     vendaList:                 get(dados, ['vendaList'], get(state.data, ['vendaList'], {})),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}
export const setUnidadeAtual = (state, {unidadeAtual}) => {  
  return state.merge({data: {...state.data, unidadeAtual}});
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const cleanMensagemUnidade = (state) => state.merge({data: {...state.data, mensagemUnidade: []}})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.DASHBOARD_SUCCESS]                         : success,
  [Types.DASHBOARD_FAILURE]                         : failure,
  [Types.DASHBOARD_CLEAN_MESSAGE]                   : cleanMessage,
  [Types.DASHBOARD_CLEAN_MENSAGEM_UNIDADE]          : cleanMensagemUnidade,
  [Types.DASHBOARD_GET_POPULACAO_TOTAL]             : request,
  [Types.DASHBOARD_GET_TOTAL_COLABORADOR_POR_TIPO]  : request,
  [Types.DASHBOARD_GET_POPULACAO_TOTAL_POR_UNIDADE] : request,
  [Types.DASHBOARD_SET_UNIDADE_ATUAL]               : setUnidadeAtual,
  [Types.DASHBOARD_PESQUISAR_MENSAGEM_UNIDADE]      : request,
  [Types.DASHBOARD_PESQUISAR_VENDA]                 : request,
})
