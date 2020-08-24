import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.Produto.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.produtoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.produtoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.produtoFailure())
  }
}

export function * pesquisar (api, { produto })  {
  try {    
    const response = yield call(api.Produto.pesquisar, produto)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.produtoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.produtoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.produtoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Produto.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.produtoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.produtoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.produtoFailure())
  }
}

export function * pesquisarProduto (api, { obj })  {
  try {    
    const response = yield call(api.Produto.pesquisar, obj)
      if (response.ok) {
        const produtoList = get(response, ['data'], {})
        yield put(Actions.produtoSuccess({produtoList}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.produtoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.produtoFailure())
  }
}
