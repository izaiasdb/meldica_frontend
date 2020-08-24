import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  perfilInit: null,
  perfilSuccess: ['dados'],
  perfilPesquisar: ['perfil'],
  perfilFailure: ['message'],
  perfilCleanMessage: null,
  perfilSalvar: ['obj'],
  perfilSetState: ['state'],
  perfilSetPerfil: ['perfil'],
  perfilCleanTable: null,
  perfilSetCheckedKeys: ['checkedKeys'],
});

export const PerfilTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data:  {},
  fetching: false,
  state: SEARCHING,
  perfil: null,
  checkedKeys: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:           get(dados, ['list'], get(state.data, ['list'], [])),
    message:        get(dados, ['message'], get(state.data, ['message'], [])),
    menus:          get(dados, ['menus'], get(state.data, ['menus'], [])),
  }

  state = state.merge({fetching: false, data})
  return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const cleanTable = (state) => state.merge({data: {...state.data, list: []}})

export const setState = (state, action) => state.merge({state: action.state})
export const setPerfil = (state, { perfil }) => state.merge({perfil})
export const setCheckedKeys = (state, { checkedKeys = []}) => state.merge({checkedKeys})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PERFIL_INIT]             : request,
  [Types.PERFIL_SUCCESS]          : success,
  [Types.PERFIL_PESQUISAR]        : request,
  [Types.PERFIL_FAILURE]          : failure,
  [Types.PERFIL_CLEAN_MESSAGE]    : cleanMessage,
  [Types.PERFIL_SALVAR]           : request,
  [Types.PERFIL_SET_STATE]        : setState,
  [Types.PERFIL_SET_PERFIL]       : setPerfil,
  [Types.PERFIL_CLEAN_TABLE]      : cleanTable,
  [Types.PERFIL_SET_CHECKED_KEYS] : setCheckedKeys,
})
