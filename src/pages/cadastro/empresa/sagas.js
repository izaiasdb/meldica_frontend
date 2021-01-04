import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Empresa.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.empresaSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.empresaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.empresaFailure())
  }
}

export function * pesquisar (api, { empresa })  {
  try {    
    const response = yield call(api.Empresa.pesquisar, empresa)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.empresaSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.empresaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.empresaFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Empresa.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.empresaSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.empresaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.empresaFailure())
  }
}

/*
export function * pesquisarEmpresa (api, { obj })  {
  try {    
    const response = yield call(api.Empresa.pesquisar, obj)
      if (response.ok) {
        const empresaList = get(response, ['data'], {})
        yield put(Actions.empresaSuccess({empresaList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.empresaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.empresaFailure())
  }
}*/
