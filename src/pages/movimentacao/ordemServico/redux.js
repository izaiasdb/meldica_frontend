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
   ordemServicoSetDrawerVisivel: ['drawerVisivel'],
   ordemServicoSetDrawerKitVisivel: ['drawerKitVisivel'],
   ordemServicoSetKitProdutoList: ['kitProdutoList'],
   ordemServicoImprimir : ['id'],
});

export const OrdemServicoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    ordemServico: null,
    drawerVisivel: false,
    drawerKitVisivel: false,
    kitProdutoList: []
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                       get(dados, ['list'], get(state.data, ['list'], [])),
    message:                    get(dados, ['message'], get(state.data, ['message'], [])),
    clienteList:                get(dados, ['clienteList'], get(state.data, ['clienteList'], [])),
    funcionarioList:            get(dados, ['funcionarioList'], get(state.data, ['funcionarioList'], [])),    
    produtoList:                get(dados, ['produtoList'], get(state.data, ['produtoList'], [])),
    formaCondicaoList:          get(dados, ['formaCondicaoList'], get(state.data, ['formaCondicaoList'], [])),    
    ufList:                     get(dados, ['ufList'], get(state.data, ['ufList'], [])),
    municipioList:              get(dados, ['municipioList'], get(state.data, ['municipioList'], [])),
    transportadoraList:         get(dados, ['transportadoraList'], get(state.data, ['transportadoraList'], [])),
    tabelaPrecoList:            get(dados, ['tabelaPrecoList'], get(state.data, ['tabelaPrecoList'], [])),
    tabelaPrecoProdutoList:     get(dados, ['tabelaPrecoProdutoList'], get(state.data, ['tabelaPrecoProdutoList'], [])),
    clienteTabelaPrecoList:     get(dados, ['clienteTabelaPrecoList'], get(state.data, ['clienteTabelaPrecoList'], [])),
    clienteRazaoList:           get(dados, ['clienteRazaoList'], get(state.data, ['clienteRazaoList'], [])),
    planoContaList:             get(dados, ['planoContaList'], get(state.data, ['planoContaList'], [])),
    clienteEnderecoList:        get(dados, ['clienteEnderecoList'], get(state.data, ['clienteEnderecoList'], [])),
    transportadoraEnderecoList: get(dados, ['transportadoraEnderecoList'], get(state.data, ['transportadoraEnderecoList'], [])),
    configuracaoList:           get(dados, ['configuracaoList'], get(state.data, ['configuracaoList'], [])),
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

export const setDrawerVisivel = (state, { drawerVisivel }) => state.merge( { drawerVisivel } )
export const setDrawerKitVisivel = (state, { drawerKitVisivel }) => state.merge( { drawerKitVisivel } )
export const setKitProdutoList = (state, { kitProdutoList }) => state.merge( { kitProdutoList } )

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ORDEM_SERVICO_INIT]              : request,
  [Types.ORDEM_SERVICO_SUCCESS]           : success,
  [Types.ORDEM_SERVICO_PESQUISAR]         : request,
  [Types.ORDEM_SERVICO_IMPRIMIR]          : request,
  [Types.ORDEM_SERVICO_FAILURE]           : failure,
  [Types.ORDEM_SERVICO_CLEAN_MESSAGE]     : cleanMessage,
  [Types.ORDEM_SERVICO_SALVAR]            : request,
  [Types.ORDEM_SERVICO_SET_STATE_VIEW]    : setStateView,
  [Types.ORDEM_SERVICO_SET_ORDEM_SERVICO] : setOrdemServico,
  [Types.ORDEM_SERVICO_CLEAN_TABLE]       : cleanTable,
  [Types.ORDEM_SERVICO_ALTERAR_STATUS]    : request,
  [Types.ORDEM_SERVICO_SET_DRAWER_VISIVEL]: setDrawerVisivel,
  [Types.ORDEM_SERVICO_SET_DRAWER_KIT_VISIVEL]: setDrawerKitVisivel,
  [Types.ORDEM_SERVICO_SET_KIT_PRODUTO_LIST]: setKitProdutoList,
})
