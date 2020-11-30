import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Cargo.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.cargoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.cargoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.cargoFailure())
  }
}

export function * pesquisar (api, { cargo })  {
  try {    
    const response = yield call(api.Cargo.pesquisar, cargo)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.cargoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.cargoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.cargoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Cargo.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.cargoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.cargoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.cargoFailure())
  }
}
