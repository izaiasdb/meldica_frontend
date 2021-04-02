import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * initReceber (api)  {
  try {    
      const response = yield call(api.ContasReceber.initReceber)
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

export function * initPagar (api)  {
  try {    
      const response = yield call(api.ContasReceber.initPagar)
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

export function * obter(api, { id })  {
  try {    
    const response = yield call(api.ContasReceber.obter, id)

    if (response.ok) {
      const contasReceber = get(response, ['data'], {})
      yield put(Actions.contasReceberSetContasReceber(contasReceber))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.contasReceberFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.contasReceberFailure())
  }
}

export function * pesquisarPagar (api, { contasReceber })  {
  try {
    console.log('opa')    
    const response = yield call(api.ContasReceber.pesquisarPagar, contasReceber)

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

export function * pesquisarReceber (api, { contasReceber })  {
  try {
    console.log('opa')    
    const response = yield call(api.ContasReceber.pesquisarReceber, contasReceber)

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

export function * excluir (api, { obj })  {
  try {
    const { id } = getUser();
    // Erro imutavel
    // console.log(obj)
    // obj.idUsuarioAlteracao = id;

    // if (!obj.id){
    //   obj.idUsuarioInclusao = id;
    // }

    console.log(obj)
    const response = yield call(api.ContasReceber.excluir, {...obj, idUsuarioAlteracao: id, idUsuarioInclusao: id })
    
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

export function * excluirItem (api, { obj })  {
  try {
    const { id } = getUser();
    // obj.idUsuarioAlteracao = id;

    // if (!obj.id){
    //   obj.idUsuarioInclusao = id;
    // }

    const response = yield call(api.ContasReceber.excluirItem, {...obj, idUsuarioAlteracao: id, idUsuarioInclusao: id  })
    
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