import { call, put } from 'redux-saga/effects'
import Action from './redux';
import { get } from "lodash";

export function * fetch (api)  {
  try {    
      const response = yield call(api.RelatorioOrdemServico.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Action.relatorioResumoMensalSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Action.relatorioResumoMensalFailure(message))
     }
  } catch (ex) {
    yield put(Action.relatorioResumoMensalFailure())
  }
}

export function * pesquisar (api, { obj })  {
  try {    
    const response = yield call(api.RelatorioOrdemServico.pesquisar, obj)
    
    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(Action.relatorioResumoMensalSuccess({list}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Action.relatorioResumoMensalFailure(message))
    }
  } catch (ex) {
    yield put(Action.relatorioResumoMensalFailure())
  }
}