import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { MESSAGE_ERROR_DEFAULT } from '../util/messages'

const { Types, Creators } = createActions({
   buscaRapidaSuccess: ['dados'],
   buscaRapidaFailure: ['message'],
   buscaRapidaCleanMessage: null,
   buscaRapidaSearch: ['searchValue'],
   buscaRapidaCleanSearch: null,
});

export const BuscaRapidaTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false
});

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
     result: get(dados, ['result'], get(state.data, ['result'], []))
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const cleanSearch = (state) => state.merge({data: {...state.data, result: []}})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BUSCA_RAPIDA_SUCCESS]        : success,
  [Types.BUSCA_RAPIDA_FAILURE]        : failure,
  [Types.BUSCA_RAPIDA_CLEAN_MESSAGE]  : cleanMessage,
  [Types.BUSCA_RAPIDA_SEARCH]         : request,
  [Types.BUSCA_RAPIDA_CLEAN_SEARCH]  : cleanSearch,
})
