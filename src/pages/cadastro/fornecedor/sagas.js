import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Fornecedor.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.fornecedorSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.fornecedorFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fornecedorFailure())
  }
}

export function * pesquisar (api, { fornecedor })  {
  try {    
    const response = yield call(api.Fornecedor.pesquisar, fornecedor)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.fornecedorSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.fornecedorFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fornecedorFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Fornecedor.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.fornecedorSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fornecedorFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fornecedorFailure())
  }
}

/*
export function * pesquisarFornecedor (api, { obj })  {
  try {    
    const response = yield call(api.Fornecedor.pesquisar, obj)
      if (response.ok) {
        const fornecedorList = get(response, ['data'], {})
        yield put(Actions.fornecedorSuccess({fornecedorList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.fornecedorFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fornecedorFailure())
  }
}*/
