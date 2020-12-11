import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Transportadora.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.transportadoraSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.transportadoraFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.transportadoraFailure())
  }
}

export function * pesquisar (api, { transportadora })  {
  try {    
    const response = yield call(api.Transportadora.pesquisar, transportadora)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.transportadoraSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.transportadoraFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.transportadoraFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Transportadora.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.transportadoraSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.transportadoraFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.transportadoraFailure())
  }
}

