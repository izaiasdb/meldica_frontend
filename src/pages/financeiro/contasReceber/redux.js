import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   contasReceberInitReceber: null,
   contasReceberInitPagar: null,
   contasReceberSuccess: ['dados'],
   contasReceberPesquisarReceber: ['contasReceber'],
   contasReceberPesquisarPagar: ['contasReceber'],
   contasReceberFailure: ['message'],
   contasReceberCleanMessage: null,
   contasReceberSalvar: ['obj'],
   contasReceberSetStateView: ['stateView'],
   contasReceberSetTipoTela: ['tipoTela'],
   contasReceberSetContasReceber: ['contasReceber'],
   contasReceberSetContasReceberItem: ['contasReceberItem'],
   contasReceberCleanTable: null,
   contasReceberPagar: ['obj'],
   contasReceberPagarParte: ['obj'],
   contasReceberExcluir: ['obj'],
   contasReceberExcluirItem: ['obj'],
});

export const ContasReceberTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    tipoTela: 'PAGAR',
    contasReceber: null,
    contasReceberItem: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                  get(dados, ['list'], get(state.data, ['list'], [])),
    message:               get(dados, ['message'], get(state.data, ['message'], [])),
    clienteList:           get(dados, ['clienteList'], get(state.data, ['clienteList'], [])),
    fornecedorList:        get(dados, ['fornecedorList'], get(state.data, ['fornecedorList'], [])),
    formaCondicaoList:     get(dados, ['formaCondicaoList'], get(state.data, ['formaCondicaoList'], [])), 
    planoContaList:        get(dados, ['planoContaList'], get(state.data, ['planoContaList'], [])),    
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
export const setTipoTela = (state, action) => state.merge({tipoTela: action.tipoTela})
export const setContasReceber = (state, { contasReceber }) => state.merge({contasReceber})
export const setContasReceberItem = (state, { contasReceberItem }) => state.merge({contasReceberItem})

export const setContasReceberItems = (state, { contasReceberItems }) => state.merge({
  contasReceber: {
    ...state.contasReceber,
    contasReceberItems
  }  
})

export const finalizarContasReceber = (state, { contasReceber }) => state.merge({fetching: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONTAS_RECEBER_INIT_RECEBER]            : request,
  [Types.CONTAS_RECEBER_INIT_PAGAR]              : request,
  [Types.CONTAS_RECEBER_SUCCESS]                 : success,
  [Types.CONTAS_RECEBER_PESQUISAR_RECEBER]       : request,
  [Types.CONTAS_RECEBER_PESQUISAR_PAGAR]         : request,
  [Types.CONTAS_RECEBER_FAILURE]                 : failure,
  [Types.CONTAS_RECEBER_CLEAN_MESSAGE]           : cleanMessage,
  [Types.CONTAS_RECEBER_SALVAR]                  : request,
  [Types.CONTAS_RECEBER_SET_STATE_VIEW]          : setStateView,
  [Types.CONTAS_RECEBER_SET_TIPO_TELA]           : setTipoTela,
  [Types.CONTAS_RECEBER_SET_CONTAS_RECEBER]      : setContasReceber,
  [Types.CONTAS_RECEBER_SET_CONTAS_RECEBER_ITEM] : setContasReceberItem,
  [Types.CONTAS_RECEBER_CLEAN_TABLE]             : cleanTable,
  [Types.CONTAS_RECEBER_PAGAR]                   : request,
  [Types.CONTAS_RECEBER_PAGAR_PARTE]             : request,
  [Types.CONTAS_RECEBER_EXCLUIR]                 : request,
  [Types.CONTAS_RECEBER_EXCLUIR_ITEM]            : request,
})
