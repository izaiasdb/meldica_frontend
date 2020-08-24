import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  mensagemDashboardInit: null,
  mensagemDashboardSuccess: ['dados'],
  mensagemDashboardPesquisar: ['obj'],
  mensagemDashboardFailure: ['message'],
  mensagemDashboardCleanMessage: null,
  mensagemDashboardSalvar: ['obj'],
  mensagemDashboardDeletar: ['obj'],
  mensagemDashboardSetState: ['state'],
  mensagemDashboardSetMensagemDashboard: ['obj'],
  mensagemDashboardCleanTable: null
});

export const MensagemDashboardTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  fetching: false,
  state: SEARCHING,
  obj: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) => {

  let data = {
    list: get(dados, ['list'], get(state.data, ['list'], [])),
    message: get(dados, ['message'], get(state.data, ['message'], [])),
  }

  state = state.merge({ fetching: false, data })
  return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({ data: { ...state.data, message: "" } })
export const cleanTable = (state) => state.merge({ data: { ...state.data, list: [] } })

export const setState = (state, action) => state.merge({ state: action.state })
export const setMensagemDashboard = (state, { obj }) => state.merge({ obj })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MENSAGEM_DASHBOARD_INIT]: request,
  [Types.MENSAGEM_DASHBOARD_SUCCESS]: success,
  [Types.MENSAGEM_DASHBOARD_PESQUISAR]: request,
  [Types.MENSAGEM_DASHBOARD_FAILURE]: failure,
  [Types.MENSAGEM_DASHBOARD_CLEAN_MESSAGE]: cleanMessage,
  [Types.MENSAGEM_DASHBOARD_SALVAR]: request,
  [Types.MENSAGEM_DASHBOARD_DELETAR]: request,
  [Types.MENSAGEM_DASHBOARD_SET_STATE]: setState,
  [Types.MENSAGEM_DASHBOARD_SET_MENSAGEM_DASHBOARD]: setMensagemDashboard,
  [Types.MENSAGEM_DASHBOARD_CLEAN_TABLE]: cleanTable,
})
