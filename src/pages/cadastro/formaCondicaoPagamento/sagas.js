import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.FormaCondicaoPagamento.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.formaCondicaoPagamentoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.formaCondicaoPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaCondicaoPagamentoFailure())
  }
}

export function * pesquisar (api, { formaCondicaoPagamento })  {
  try {    
    const response = yield call(api.FormaCondicaoPagamento.pesquisar, formaCondicaoPagamento)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.formaCondicaoPagamentoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.formaCondicaoPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaCondicaoPagamentoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.FormaCondicaoPagamento.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.formaCondicaoPagamentoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.formaCondicaoPagamentoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaCondicaoPagamentoFailure())
  }
}

export function * cancelar (api, { obj })  {
  try {
    const { id } = getUser();
    const response = yield call(api.FormaCondicaoPagamento.cancelar, {...obj, idUsuarioAlteracao: id })
    
    if (response.ok) {
      yield put(Actions.formaCondicaoPagamentoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'cancelado'} com sucesso.`
        }
      }))
      yield put(Actions.formaCondicaoPagamentoCleanTable());
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.formaCondicaoPagamentoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.formaCondicaoPagamentoFailure())
  }
}
