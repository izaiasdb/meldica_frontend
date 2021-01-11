import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { get } from "lodash"
import { MESSAGE_ERROR_DEFAULT } from '../pages/util/messages'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   mainLayoutInit: null,
   mainLayoutSuccess: ['dados'],
   mainLayoutPesquisar: ['mainLayout'],
   mainLayoutFailure: ['message'],
   mainLayoutCleanMessage: null,
   mainLayoutSetModalAlertaLogisticaVisivel: ['modalAlertaLogisticaVisivel'],
   mainLayoutSetModalAlertaVendedorVisivel: ['modalAlertaVendedorVisivel'],
   //mainLayoutInativarAlerta: ['obj'],
   //mainLayoutMarcarLido: ['obj'],
});

export const MainLayoutTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data:  {},
    fetching: false,
    mainLayout: null,
    modalAlertaLogisticaVisivel: false,
    modalAlertaVendedorVisivel: false,
});

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })
export const success = (state, { dados }) =>  {

  let data = {
    message:               get(dados, ['message'], get(state.data, ['message'], [])),
    pedidoLogisticaList:   get(dados, ['pedidoLogisticaList'], get(state.data, ['pedidoLogisticaList'], [])),
    pedidoReabertoList:    get(dados, ['pedidoReabertoList'], get(state.data, ['pedidoReabertoList'], [])),
  }

   state = state.merge({fetching: false, data})
   return state
}

export const failure = (state, { message = MESSAGE_ERROR_DEFAULT}) => {
  return state.merge({fetching: false, data: {...state.data, message: {tipo: 'error', descricao: message }}})
}

export const cleanMessage = (state) => state.merge({data: {...state.data, message: ""}})
export const setModalAlertaVendedorVisivel = (state, { modalAlertaVendedorVisivel }) => state.merge( { modalAlertaVendedorVisivel } )
export const setModalAlertaLogisticaVisivel = (state, { modalAlertaLogisticaVisivel }) => state.merge( { modalAlertaLogisticaVisivel } )

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MAIN_LAYOUT_INIT]              : request,
  [Types.MAIN_LAYOUT_SUCCESS]           : success,
  [Types.MAIN_LAYOUT_PESQUISAR]         : request,
  [Types.MAIN_LAYOUT_FAILURE]           : failure,  
  [Types.MAIN_LAYOUT_CLEAN_MESSAGE]     : cleanMessage,
  [Types.MAIN_LAYOUT_SET_MODAL_ALERTA_VENDEDOR_VISIVEL] : setModalAlertaVendedorVisivel,
  [Types.MAIN_LAYOUT_SET_MODAL_ALERTA_LOGISTICA_VISIVEL] : setModalAlertaLogisticaVisivel,
  //[Types.MAIN_LAYOUT_INATIVAR_ALERTA]    : request,
  //[Types.MAIN_LAYOUT_MARCAR_LIDO]        : request,
})
