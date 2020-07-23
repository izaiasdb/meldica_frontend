import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

const { Types, Creators } = createActions({
   loginSuccess: ['dados'],
   loginFailure: ['message'],
   loginCleanMessage: null,
   loginLogar: ['credenciais'],
   loginEsqueciSenha: ['credenciais'],
   loginAlterarSenha: ['credenciais'],
   loginLogout: null,
   loginCleanProfile: null,
   loginRefreshProfile: null,
   loginSetUnidadeAtual: ['unidadeAtual']
});

export const LoginTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false
});

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {    
     profile: get(dados, ['profile'], get(state.data, ['profile'], [])),
     message: get(dados, ['message'], get(state.data, ['message'], [])),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanProfile = (state) => state.merge({fetching: false, data: {...state.data, profile: undefined}})
export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const setUnidadeAtual = (state, {unidadeAtual}) => state.merge({data: {...state.data, profile: {...state.data.profile, unidadeAtual}}})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_SUCCESS]         : success,
  [Types.LOGIN_FAILURE]         : failure,
  [Types.LOGIN_CLEAN_MESSAGE]   : cleanMessage,
  [Types.LOGIN_LOGAR]           : request,
  [Types.LOGIN_LOGOUT]          : request,
  [Types.LOGIN_CLEAN_PROFILE]   : cleanProfile,
  [Types.LOGIN_REFRESH_PROFILE] : request,
  [Types.LOGIN_SET_UNIDADE_ATUAL] : setUnidadeAtual,
  [Types.LOGIN_ESQUECI_SENHA]     : request,
  [Types.LOGIN_ALTERAR_SENHA]     : request,
})

