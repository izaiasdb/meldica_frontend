import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    alterarSenhaSuccess: ['dados'],
    alterarSenhaFailure: ['message'],
    alterarSenhaCleanMessage: null,
    alterarSenhaSalvar: ['obj'],
    alterarSenhaSetVisivel: ['visivel'],
  });
  
  export const AlterarSenhaTypes = Types;
  export default Creators;
  
  /* ------------- Initial State ------------- */
  
  export const INITIAL_STATE = Immutable({
    data: {},
    fetching: false,
    visivel: false,
  });
  
  /* ------------- Reducers ------------- */
  
  export const request = (state) => state.merge({ fetching: true })
  export const success = (state, { dados }) =>  {
  
    let data = {
      message: get(dados, ['message'], get(state.data, ['message'], [])),
    }
  
    state = state.merge({fetching: false, data})
    return state
  }
  
  export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
    return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
  }
  
  export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
  export const setVisivel = (state, { visivel }) => state.merge( { visivel } )
  
  /* ------------- Hookup Reducers To Types ------------- */
  
  export const reducer = createReducer(INITIAL_STATE, {
    [Types.ALTERAR_SENHA_SUCCESS]          : success,
    [Types.ALTERAR_SENHA_FAILURE]          : failure,
    [Types.ALTERAR_SENHA_CLEAN_MESSAGE]    : cleanMessage,
    [Types.ALTERAR_SENHA_SALVAR]           : request,
    [Types.ALTERAR_SENHA_SET_VISIVEL]      : setVisivel,    
  })
  