import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   menuInit: null,
   menuSuccess: ['dados'],
   menuPesquisar: ['menu'],
   menuFailure: ['message'],
   menuCleanMessage: null,
   menuSalvar: ['obj'],
   menuSetState: ['state'],
   menuSetMenu: ['menu'],
   menuCleanTable: null,
   menuPesquisarMenu: ['obj'],
});

export const MenuTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    state: SEARCHING,
    menu: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    list:                get(dados, ['list'], get(state.data, ['list'], [])),
    message:             get(dados, ['message'], get(state.data, ['message'], [])),
    modulos:             get(dados, ['modulos'], get(state.data, ['modulos'], [])),
    menus:               get(dados, ['menus'], get(state.data, ['menus'], [])),
    permissoes:          get(dados, ['permissoes'], get(state.data, ['permissoes'], [])),
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
export const setMenu = (state, { menu }) => state.merge({menu})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MENU_INIT]               : request,
  [Types.MENU_SUCCESS]            : success,
  [Types.MENU_PESQUISAR]          : request,
  [Types.MENU_FAILURE]            : failure,
  [Types.MENU_CLEAN_MESSAGE]      : cleanMessage,
  [Types.MENU_SALVAR]             : request,
  [Types.MENU_SET_STATE]          : setState,
  [Types.MENU_SET_MENU]           : setMenu,
  [Types.MENU_CLEAN_TABLE]        : cleanTable,
  [Types.MENU_PESQUISAR_MENU]     : request,
})
