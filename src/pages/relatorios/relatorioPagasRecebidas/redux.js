import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  relatorioPagasRecebidasInit: null,
  relatorioPagasRecebidasSuccess: ['dados'],
  relatorioPagasRecebidasPesquisar: ['obj'],
  relatorioPagasRecebidasFailure: ['msgError'],
  relatorioPagasRecebidasCleanMessage: null,
  relatorioPagasRecebidasCleanTable: null,
});

export const RelatorioPagasRecebidasTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  fetching: false,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) => {
  
  let data = {
    list: get(dados, ['list'], get(state.data, ['list'], [])),
    message: get(dados, ['message'], get(state.data, ['message'], [])),
    tipoTerminalList: get(dados, ['tipoTerminalList'], get(state.data, ['tipoTerminalList'], [])),
  }

  state = state.merge({ fetching: false, data })
  return state
}

export const failure = (state, { msgError }) => {
  return state.merge({ fetching: false, data: { ...state.data, message: msgError } })
}

export const cleanMessage = (state) => state.merge({ data: { ...state.data, message: "" } })
export const cleanTable = (state) => state.merge({ data: { ...state.data, list: [] } })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RELATORIO_PAGAS_RECEBIDAS_INIT]: request,
  [Types.RELATORIO_PAGAS_RECEBIDAS_SUCCESS]: success,
  [Types.RELATORIO_PAGAS_RECEBIDAS_PESQUISAR]: request,
  [Types.RELATORIO_PAGAS_RECEBIDAS_FAILURE]: failure,
  [Types.RELATORIO_PAGAS_RECEBIDAS_CLEAN_MESSAGE]: cleanMessage,
  [Types.RELATORIO_PAGAS_RECEBIDAS_CLEAN_TABLE]: cleanTable,
})
