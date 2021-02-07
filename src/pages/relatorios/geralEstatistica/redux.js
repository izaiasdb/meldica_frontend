import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { SEARCHING } from '../../util/state'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  relatorioGeralInit: null,
  relatorioGeralSuccess: ['dados'],
  relatorioGeralFailure: ['msgError'],
  relatorioGeralCleanMessage: null,
  relatorioGeralSetState: ['state'],
});

export const RelatorioGeralTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  fetching: false,
  state : SEARCHING
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) => {

  let data = {
    list: get(dados, ['list'], get(state.data, ['list'], [])),
    message: get(dados, ['message'], get(state.data, ['message'], [])),
  }

  state = state.merge({ fetching: false, data })
  return state
}

export const failure = (state, { msgError }) => {
  return state.merge({ fetching: false, data: { ...state.data, message: msgError } })
}

export const cleanMessage = (state) => state.merge({ data: { ...state.data, message: "" } })

export const setState = (state, action) => state.merge({state: action.state})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RELATORIO_GERAL_INIT]: request,
  [Types.RELATORIO_GERAL_SUCCESS]: success,
  [Types.RELATORIO_GERAL_FAILURE]: failure,
  [Types.RELATORIO_GERAL_CLEAN_MESSAGE]: cleanMessage,
  [Types.RELATORIO_GERAL_SET_STATE]: setState,
})
