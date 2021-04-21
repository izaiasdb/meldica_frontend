import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"

import { STATE_CADASTRO } from '../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   fichaPessoaGetDados: ['id', 'tipoPessoa'],
   fichaPessoaSuccess:  ['dados'],
   fichaPessoaFailure:  ['message'],
   fichaPessoaSetState: ['state'],
   fichaPessoaSetTipoPessoa: ['tipoPessoa'],
   fichaPessoaImprimir : ['id', 'tipoPessoa'],   
   fichaPessoaGetCliente: ['id'],
   fichaPessoaGetServidor: ['id'],
   fichaPessoaGetTerceirizado: ['id'],
   fichaPessoaGetPrestadorServico: ['id'],
   fichaPessoaGetVisitante: ['id'],
   fichaPessoaAlterarFoto: ['obj'],
   fichaPessoaGetVisitanteUnidade: ['id'],
});

export const FichaPessoaTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    state: STATE_CADASTRO,
    tipoPessoa: null
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    dados: get(dados, ['dados'], get(state.data, ['dados'], [])),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const setState = (state, action) => state.merge({state: action.state})
export const setTipoPessoa = (state, action) => state.merge({tipoPessoa: action.tipoPessoa})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FICHA_PESSOA_GET_DADOS]             : request,
  [Types.FICHA_PESSOA_SUCCESS]               : success,
  [Types.FICHA_PESSOA_FAILURE]               : failure,
  [Types.FICHA_PESSOA_SET_STATE]             : setState,
  [Types.FICHA_PESSOA_SET_TIPO_PESSOA]       : setTipoPessoa,
  [Types.FICHA_PESSOA_IMPRIMIR]              : request,
  [Types.FICHA_PESSOA_GET_CLIENTE]           : request,
  [Types.FICHA_PESSOA_GET_SERVIDOR]          : request,
  [Types.FICHA_PESSOA_GET_TERCEIRIZADO]      : request,
  [Types.FICHA_PESSOA_GET_PRESTADOR_SERVICO] : request,
  [Types.FICHA_PESSOA_GET_VISITANTE]         : request,  
  [Types.FICHA_PESSOA_ALTERAR_FOTO]          : request,
  [Types.FICHA_PESSOA_GET_VISITANTE_UNIDADE] : request,  
})
