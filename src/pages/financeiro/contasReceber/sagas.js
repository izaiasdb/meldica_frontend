import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.ContasReceber.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.contasReceberSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.contasReceberFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}

export function * pesquisar (api, { contasReceber })  {
  try {
    console.log('opa')    
    const response = yield call(api.ContasReceber.pesquisar, contasReceber)

    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(Actions.contasReceberSuccess({list}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.contasReceberFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.ContasReceber.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.contasReceberSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.contasReceberFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}

export function * pagar (api, { obj })  {
  try {
    const { id } = getUser();
    //obj.idUsuarioAlteracao = id;

    const response = yield call(api.ContasReceber.pagar, {...obj, idUsuarioAlteracao: id })
    
    if (response.ok) {
      yield put(Actions.contasReceberSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.contasReceberFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}

export function * pagarParte (api, { obj })  {
  try {
    const { id } = getUser();

    const response = yield call(api.ContasReceber.pagarParte, {...obj, idUsuarioInclusao: id, idUsuarioAlteracao: id })
    
    if (response.ok) {
      yield put(Actions.contasReceberSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.contasReceberFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}