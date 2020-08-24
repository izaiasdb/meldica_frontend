import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import ModuloActions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Modulo.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(ModuloActions.moduloSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(ModuloActions.moduloFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(ModuloActions.moduloFailure())
  }
}

export function * pesquisar (api, { modulo })  {
  try {    
    const response = yield call(api.Modulo.pesquisar, modulo)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(ModuloActions.moduloSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(ModuloActions.moduloFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(ModuloActions.moduloFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Modulo.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(ModuloActions.moduloSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(ModuloActions.moduloFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(ModuloActions.moduloFailure())
  }
}
