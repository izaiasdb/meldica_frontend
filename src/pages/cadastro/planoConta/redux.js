import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   planoContaInit: null,
   planoContaSuccess: ['dados'],
   planoContaPesquisar: ['planoConta'],
   planoContaFailure: ['message'],
   planoContaCleanMessage: null,
   planoContaSalvar: ['obj'],
   planoContaSetStateView: ['stateView'],
   planoContaSetPlanoConta: ['planoConta'],
   planoContaCleanTable: null,
   //planoContaPesquisarPlanoConta: ['obj'],
});

export const PlanoContaTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    planoConta: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                get(dados, ['list'], get(state.data, ['list'], [])),
    message:             get(dados, ['message'], get(state.data, ['message'], [])),
    planoContaList:      get(dados, ['planoContaList'], get(state.data, ['planoContaList'], [])),
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
export const setPlanoConta = (state, { planoConta }) => state.merge({planoConta})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PLANO_CONTA_INIT]               : request,
  [Types.PLANO_CONTA_SUCCESS]            : success,
  [Types.PLANO_CONTA_PESQUISAR]          : request,
  [Types.PLANO_CONTA_FAILURE]            : failure,
  [Types.PLANO_CONTA_CLEAN_MESSAGE]      : cleanMessage,
  [Types.PLANO_CONTA_SALVAR]                : request,
  [Types.PLANO_CONTA_SET_STATE_VIEW]        : setStateView,
  [Types.PLANO_CONTA_SET_PLANO_CONTA]       : setPlanoConta,
  [Types.PLANO_CONTA_CLEAN_TABLE]           : cleanTable,
  //[Types.PLANO_CONTA_PESQUISAR_PLANO_CONTA] : request,
})
