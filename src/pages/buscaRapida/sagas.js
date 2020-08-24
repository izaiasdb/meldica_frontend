import { call, put } from 'redux-saga/effects'
import BuscaRapidaActions from './redux';
import { get } from "lodash";

export function * search ( api, { searchValue } )  {
  try {    
    const response = yield call(api.BuscaRapida.search, {nome: searchValue})
      if (response.ok) {
        let dados = get(response, ['data'], {})
        yield put(BuscaRapidaActions.buscaRapidaSuccess({result: dados}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(BuscaRapidaActions.buscaRapidaFailure(message))
     }

  } catch (ex) {
    console.log(ex)
    yield put(BuscaRapidaActions.buscaRapidaFailure())
  }
}
