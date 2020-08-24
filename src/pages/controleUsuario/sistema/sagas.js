import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import SistemaActions from './redux';

export function * pesquisar (api, { sistema })  {
  try {    
    const response = yield call(api.Sistema.pesquisar, sistema)

      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(SistemaActions.sistemaSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(SistemaActions.sistemaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(SistemaActions.sistemaFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }    

    const response = yield call(api.Sistema.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(SistemaActions.sistemaSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(SistemaActions.sistemaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(SistemaActions.sistemaFailure())
  }
}
