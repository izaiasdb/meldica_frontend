import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({  
  usuarioInit: null,
  usuarioSuccess: ['dados'],
  usuarioPesquisar: ['usuario'],
  usuarioFailure: ['message'],
  usuarioCleanMessage: null,
  usuarioSalvar: ['obj'],
  usuarioSetState: ['state'],
  usuarioSetUsuario: ['usuario'],
  usuarioCleanTable: null,
  usuarioSetCheckedKeys: ['checkedKeys'],
  usuarioGetPerfilPermissoes: ['id'],
  usuarioAdd: ['records'],
  usuarioSetUnidadeIds: ['unidadeIds'],
  usuarioSetFetching: ['fetching'],
});

export const UsuarioTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data:  {},
  fetching: false,
  state: SEARCHING,
  usuario: null,
  checkedKeys: null,
  unidadeIds: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:            get(dados, ['list'], get(state.data, ['list'], [])),
    message:         get(dados, ['message'], get(state.data, ['message'], [])),
    perfis:          get(dados, ['perfis'], get(state.data, ['perfis'], [])),
    menus:           get(dados, ['menus'], get(state.data, ['menus'], [])),
    unidades:        get(dados, ['unidades'], get(state.data, ['unidades'], [])),
    permissoes:      get(dados, ['permissoes'], get(state.data, ['permissoes'], [])),
    usuariounidades: get(dados, ['usuariounidades'], get(state.data, ['usuariounidades'], [])),
    funcionarioList: get(dados, ['funcionarioList'], get(state.data, ['funcionarioList'], [])),
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
export const setUsuario = (state, { usuario }) => state.merge({usuario, fetching: true})
export const setCheckedKeys = (state, { checkedKeys }) => state.merge({checkedKeys})
export const setUnidadeIds = (state, { unidadeIds }) => state.merge({ unidadeIds })
export const setFetching = (state, { fetching }) => state.merge({fetching})

export const add = (state, { records = [] }) => {
  const { data: { usuariounidades = [] }} = state
  return state.merge({data: {...state.data, usuariounidades: Array.from(new Set(usuariounidades.concat(records)))}})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USUARIO_INIT]                  : request,
  [Types.USUARIO_SUCCESS]               : success,
  [Types.USUARIO_PESQUISAR]             : request,
  [Types.USUARIO_FAILURE]               : failure,
  [Types.USUARIO_CLEAN_MESSAGE]         : cleanMessage,
  [Types.USUARIO_SALVAR]                : request,
  [Types.USUARIO_SET_STATE]             : setState,
  [Types.USUARIO_SET_USUARIO]           : setUsuario,
  [Types.USUARIO_CLEAN_TABLE]           : cleanTable,
  [Types.USUARIO_SET_CHECKED_KEYS]      : setCheckedKeys,
  [Types.USUARIO_GET_PERFIL_PERMISSOES] : request,
  [Types.USUARIO_ADD]                   : add,
  [Types.USUARIO_SET_UNIDADE_IDS]       : setUnidadeIds,
  [Types.USUARIO_SET_FETCHING]          : setFetching,
})
