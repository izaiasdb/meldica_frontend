import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   ordemServicoInit: null,
   ordemServicoSuccess: ['dados'],
   ordemServicoPesquisar: ['ordemServico'],
   ordemServicoFailure: ['message'],
   ordemServicoCleanMessage: null,
   ordemServicoSalvar: ['obj'],
   ordemServicoSetStateView: ['stateView'],
   ordemServicoSetOrdemServico: ['ordemServico'],
   ordemServicoCleanTable: null,
   ordemServicoAlterarStatus: ['obj'],
});

export const OrdemServicoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    ordemServico: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    clienteList:           get(dados, ['clienteList'], get(state.data, ['clienteList'], [])),
    funcionarioList:       get(dados, ['funcionarioList'], get(state.data, ['funcionarioList'], [])),    
    produtoList:           get(dados, ['produtoList'], get(state.data, ['produtoList'], [])),
    formaCondicaoList:     get(dados, ['formaCondicaoList'], get(state.data, ['formaCondicaoList'], [])),    
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
export const setOrdemServico = (state, { ordemServico }) => state.merge({ordemServico})

export const setOrdemServicoItems = (state, { ordemServicoItems }) => state.merge({
  ordemServico: {
    ...state.ordemServico,
    ordemServicoItems
  }  
})

export const finalizarOrdemServico = (state, { ordemServico }) => state.merge({fetching: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ORDEM_SERVICO_INIT]              : request,
  [Types.ORDEM_SERVICO_SUCCESS]           : success,
  [Types.ORDEM_SERVICO_PESQUISAR]         : request,
  [Types.ORDEM_SERVICO_FAILURE]           : failure,
  [Types.ORDEM_SERVICO_CLEAN_MESSAGE]     : cleanMessage,
  [Types.ORDEM_SERVICO_SALVAR]            : request,
  [Types.ORDEM_SERVICO_SET_STATE_VIEW]    : setStateView,
  [Types.ORDEM_SERVICO_SET_ORDEM_SERVICO] : setOrdemServico,
  [Types.ORDEM_SERVICO_CLEAN_TABLE]       : cleanTable,
  [Types.ORDEM_SERVICO_ALTERAR_STATUS]    : request,
})
