import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.FormaPagamento.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.formaPagamentoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.formaPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaPagamentoFailure())
  }
}

export function * pesquisar (api, { formaPagamento })  {
  try {    
    const response = yield call(api.FormaPagamento.pesquisar, formaPagamento)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.formaPagamentoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.formaPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaPagamentoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.FormaPagamento.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.formaPagamentoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.formaPagamentoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaPagamentoFailure())
  }
}

export function * cancelar (api, { obj })  {
  try {
    const { id } = getUser();
    const response = yield call(api.FormaPagamento.cancelar, {...obj, idUsuarioAlteracao: id })
    
    if (response.ok) {
      yield put(Actions.formaPagamentoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'cancelado'} com sucesso.`
        }
      }))
      yield put(Actions.formaPagamentoCleanTable());
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.formaPagamentoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaPagamentoFailure())
  }
}

