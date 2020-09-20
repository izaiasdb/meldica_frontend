import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Funcionario.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.funcionarioSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.funcionarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.funcionarioFailure())
  }
}

export function * pesquisar (api, { funcionario })  {
  try {    
    const response = yield call(api.Funcionario.pesquisar, funcionario)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.funcionarioSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.funcionarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.funcionarioFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Funcionario.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.funcionarioSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.funcionarioFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.funcionarioFailure())
  }
}

/*
export function * pesquisarFuncionario (api, { obj })  {
  try {    
    const response = yield call(api.Funcionario.pesquisar, obj)
      if (response.ok) {
        const funcionarioList = get(response, ['data'], {})
        yield put(Actions.funcionarioSuccess({funcionarioList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.funcionarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.funcionarioFailure())
  }
}*/
