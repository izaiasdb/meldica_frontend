import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.CondicaoPagamento.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.condicaoPagamentoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.condicaoPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.condicaoPagamentoFailure())
  }
}

export function * pesquisar (api, { condicaoPagamento })  {
  try {    
    const response = yield call(api.CondicaoPagamento.pesquisar, condicaoPagamento)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.condicaoPagamentoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.condicaoPagamentoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.condicaoPagamentoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.CondicaoPagamento.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.condicaoPagamentoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.condicaoPagamentoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.condicaoPagamentoFailure())
  }
}
