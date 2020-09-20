import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'
import { MESSAGE_ERROR_DEFAULT } from '../../util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   funcionarioInit: null,
   funcionarioSuccess: ['dados'],
   funcionarioPesquisar: ['funcionario'],
   funcionarioFailure: ['message'],
   funcionarioCleanMessage: null,
   funcionarioSalvar: ['obj'],
   funcionarioSetStateView: ['stateView'],
   funcionarioSetFuncionario: ['funcionario'],
   funcionarioCleanTable: null,
});

export const FuncionarioTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    stateView: SEARCHING,
    funcionario: null,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:              get(dados, ['message'], get(state.data, ['message'], [])),    
    list:                 get(dados, ['list'], get(state.data, ['list'], [])),    
    cargoList:            get(dados, ['cargoList'], get(state.data, ['cargoList'], [])),
    ufList:               get(dados, ['ufList'], get(state.data, ['ufList'], [])),
    municipioList:        get(dados, ['municipioList'], get(state.data, ['municipioList'], [])),    
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
export const setFuncionario = (state, { funcionario }) => state.merge({funcionario})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FUNCIONARIO_INIT]              : request,
  [Types.FUNCIONARIO_SUCCESS]           : success,
  [Types.FUNCIONARIO_PESQUISAR]         : request,
  [Types.FUNCIONARIO_FAILURE]           : failure,
  [Types.FUNCIONARIO_CLEAN_MESSAGE]     : cleanMessage,
  [Types.FUNCIONARIO_SALVAR]            : request,
  [Types.FUNCIONARIO_SET_STATE_VIEW]    : setStateView,
  [Types.FUNCIONARIO_SET_FUNCIONARIO]       : setFuncionario,
  [Types.FUNCIONARIO_CLEAN_TABLE]       : cleanTable,
})
