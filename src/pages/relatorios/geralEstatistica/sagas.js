import { call, put } from 'redux-saga/effects'
import Action from './redux';
import { get } from "lodash";

const msgError  = {tipo: 'error', descricao: "Erro inesperado, por favor, entre em contato com o administrador do sistema."}

export function * fetch (api)  {
  try {    
      const response = yield call(api.RelatorioGeralEstatistica.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Action.relatorioGeralSuccess(data))
      } else {
        yield put(Action.relatorioGeralFailure(msgError))
     }
  } catch (ex) {
    yield put(Action.relatorioGeralFailure(msgError))
  }
}
