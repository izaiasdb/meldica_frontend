import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Cliente.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.clienteSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.clienteFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}

export function * obter(api, { id })  {
  try {    
    console.log(id)
    const response = yield call(api.Cliente.obter, id)

    if (response.ok) {
      const cliente = get(response, ['data'], {})
      yield put(Actions.clienteSetCliente(cliente))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.clienteFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}

export function * pesquisar (api, { cliente })  {
  try {    
    const response = yield call(api.Cliente.pesquisar, cliente)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.clienteSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.clienteFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Cliente.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.clienteSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.clienteFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}

export function * cancelar (api, { obj })  {
  try {
    const { id } = getUser();
    const response = yield call(api.Cliente.cancelar, {...obj, idUsuarioAlteracao: id })
    
    if (response.ok) {
      yield put(Actions.clienteSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'cancelado'} com sucesso.`
        }
      }))
      yield put(Actions.clienteCleanTable());
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.clienteFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}

/*
export function * pesquisarCliente (api, { obj })  {
  try {    
    const response = yield call(api.Cliente.pesquisar, obj)
      if (response.ok) {
        const clienteList = get(response, ['data'], {})
        yield put(Actions.clienteSuccess({clienteList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.clienteFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.clienteFailure())
  }
}*/
