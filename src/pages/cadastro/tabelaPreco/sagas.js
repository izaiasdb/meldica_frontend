import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.TabelaPreco.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.tabelaPrecoFailure())
  }
}

export function * pesquisar (api, { tabelaPreco })  {
  try {    
    const response = yield call(api.TabelaPreco.pesquisar, tabelaPreco)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.tabelaPrecoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.TabelaPreco.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.tabelaPrecoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.tabelaPrecoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.tabelaPrecoFailure())
  }
}

export function * pesquisarProduto (api, { obj })  {
  try {    
    const response = yield call(api.TabelaPreco.pesquisar, obj)
      if (response.ok) {
        const produtoList = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoSuccess({produtoList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.tabelaPrecoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.tabelaPrecoFailure())
  }
}
