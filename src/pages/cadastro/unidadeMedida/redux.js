import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   unidadeMedidaInit: null,
   unidadeMedidaSuccess: ['dados'],
   unidadeMedidaPesquisar: ['unidadeMedida'],
   unidadeMedidaFailure: ['message'],
   unidadeMedidaCleanMessage: null,
   unidadeMedidaSalvar: ['obj'],
   unidadeMedidaSetStateView: ['stateView'],
   unidadeMedidaSetUnidadeMedida: ['unidadeMedida'],
   unidadeMedidaCleanTable: null,
});

export const UnidadeMedidaTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    unidadeMedida: null
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
export const setUnidadeMedida = (state, { unidadeMedida }) => state.merge({unidadeMedida})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UNIDADE_MEDIDA_INIT]               : request,
  [Types.UNIDADE_MEDIDA_SUCCESS]            : success,
  [Types.UNIDADE_MEDIDA_PESQUISAR]          : request,
  [Types.UNIDADE_MEDIDA_FAILURE]            : failure,
  [Types.UNIDADE_MEDIDA_CLEAN_MESSAGE]      : cleanMessage,
  [Types.UNIDADE_MEDIDA_SALVAR]             : request,
  [Types.UNIDADE_MEDIDA_SET_STATE_VIEW]     : setStateView,
  [Types.UNIDADE_MEDIDA_SET_UNIDADE_MEDIDA] : setUnidadeMedida,
  [Types.UNIDADE_MEDIDA_CLEAN_TABLE]        : cleanTable,
})
