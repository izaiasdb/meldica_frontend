import { call, put } from 'redux-saga/effects'
import { get } from "lodash";

import { getUser } from '../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Configuracao.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.configuracaoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.configuracaoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.configuracaoFailure())
  }
}

export function * pesquisar (api, { configuracao })  {
  try {    
    const response = yield call(api.Configuracao.pesquisar, configuracao)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.configuracaoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.configuracaoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.configuracaoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    const response = yield call(api.Configuracao.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.configuracaoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
        yield put(Actions.configuracaoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.configuracaoFailure())
  }
}
