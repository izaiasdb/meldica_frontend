import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   clienteInit: null,
   clienteSuccess: ['dados'],
   clientePesquisar: ['cliente'],
   clienteFailure: ['message'],
   clienteCleanMessage: null,
   clienteSalvar: ['obj'],
   clienteSetStateView: ['stateView'],
   clienteSetCliente: ['cliente'],
   clienteCleanTable: null,
   clienteSetDrawerVisivel: ['drawerVisivel'],
});

export const ClienteTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    cliente: null,
    drawerVisivel: false,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:                get(dados, ['message'], get(state.data, ['message'], [])),    
    list:                   get(dados, ['list'], get(state.data, ['list'], [])),
    clienteList:            get(dados, ['clienteList'], get(state.data, ['clienteList'], [])),
    ufList:                 get(dados, ['ufList'], get(state.data, ['ufList'], [])),
    municipioList:          get(dados, ['municipioList'], get(state.data, ['municipioList'], [])),
    tabelaPrecoList:        get(dados, ['tabelaPrecoList'], get(state.data, ['tabelaPrecoList'], [])),
    tabelaPrecoProdutoList: get(dados, ['tabelaPrecoProdutoList'], get(state.data, ['tabelaPrecoProdutoList'], [])),
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
export const setCliente = (state, { cliente }) => state.merge({cliente})

export const setClienteItems = (state, { clienteItems }) => state.merge({
  cliente: {
    ...state.cliente,
    clienteItems
  }  
})

export const setDrawerVisivel = (state, { drawerVisivel }) => state.merge( { drawerVisivel } )

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CLIENTE_INIT]              : request,
  [Types.CLIENTE_SUCCESS]           : success,
  [Types.CLIENTE_PESQUISAR]         : request,
  [Types.CLIENTE_FAILURE]           : failure,
  [Types.CLIENTE_CLEAN_MESSAGE]     : cleanMessage,
  [Types.CLIENTE_SALVAR]            : request,
  [Types.CLIENTE_SET_STATE_VIEW]    : setStateView,
  [Types.CLIENTE_SET_CLIENTE]       : setCliente,
  [Types.CLIENTE_CLEAN_TABLE]       : cleanTable,
  [Types.CLIENTE_SET_DRAWER_VISIVEL]: setDrawerVisivel,
})
