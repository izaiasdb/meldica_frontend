import { call, put, select } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import PerfilActions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Perfil.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(PerfilActions.perfilSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(PerfilActions.perfilFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(PerfilActions.perfilFailure())
  }
}

export function * pesquisar (api, { perfil })  {
  try {    
    const response = yield call(api.Perfil.pesquisar, perfil)

      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(PerfilActions.perfilSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(PerfilActions.perfilFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(PerfilActions.perfilFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }    
    
    const checkedKeys = yield select((state) => state.perfil.checkedKeys )
    const response = yield call(api.Perfil.salvar, {...obj, dataInclusao: null, dataAlteracao: null, permissoes: checkedKeys })

    if (response.ok) {
      yield put(PerfilActions.perfilSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(PerfilActions.perfilFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(PerfilActions.perfilFailure())
  }
}
