import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.GrupoProduto.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.grupoProdutoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.grupoProdutoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.grupoProdutoFailure())
  }
}

export function * pesquisar (api, { grupoProduto })  {
  try {    
    const response = yield call(api.GrupoProduto.pesquisar, grupoProduto)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.grupoProdutoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.grupoProdutoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.grupoProdutoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.GrupoProduto.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.grupoProdutoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.grupoProdutoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.grupoProdutoFailure())
  }
}
