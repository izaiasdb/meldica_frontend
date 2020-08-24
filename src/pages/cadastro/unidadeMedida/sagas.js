import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.UnidadeMedida.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.unidadeMedidaSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.unidadeMedidaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.unidadeMedidaFailure())
  }
}

export function * pesquisar (api, { unidadeMedida })  {
  try {    
    const response = yield call(api.UnidadeMedida.pesquisar, unidadeMedida)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.unidadeMedidaSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.unidadeMedidaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.unidadeMedidaFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.UnidadeMedida.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.unidadeMedidaSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.unidadeMedidaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.unidadeMedidaFailure())
  }
}
