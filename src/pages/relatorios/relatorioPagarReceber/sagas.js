import { call, put } from 'redux-saga/effects'
import Action from './redux';
import { get } from "lodash";

export function * fetch (api)  {
  try {    
      const response = yield call(api.RelatorioPagarReceber.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Action.relatorioPagarReceberSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Action.relatorioPagarReceberFailure(message))
     }
  } catch (ex) {
    yield put(Action.relatorioPagarReceberFailure())
  }
}

export function * pesquisar (api, { obj })  {
  try {    
    const response = yield call(api.RelatorioPagarReceber.pesquisar, {...obj, tipoRelatorio: 'A'} )
    
    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(Action.relatorioPagarReceberSuccess({list}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Action.relatorioPagarReceberFailure(message))
    }
  } catch (ex) {
    yield put(Action.relatorioPagarReceberFailure())
  }
}