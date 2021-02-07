import { call, put } from 'redux-saga/effects'
import Action from './redux';
import { get } from "lodash";

export function * fetch (api)  {
  try {    
      const response = yield call(api.RelatorioPagarReceber.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Action.relatorioPagasRecebidasSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Action.relatorioPagasRecebidasFailure(message))
     }
  } catch (ex) {
    yield put(Action.relatorioPagasRecebidasFailure())
  }
}

export function * pesquisar (api, { obj })  {
  try {    
    const response = yield call(api.RelatorioPagarReceber.pesquisar, {...obj, tipoRelatorio: 'B'} )
    
    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(Action.relatorioPagasRecebidasSuccess({list}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Action.relatorioPagasRecebidasFailure(message))
    }
  } catch (ex) {
    yield put(Action.relatorioPagasRecebidasFailure())
  }
}