import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../services/authenticationService'

export function * fetch (api)  {
  try {    
    const { id } = getUser();
    //const { unidadeAtual } = yield select(state => state.login.data.profile)
    const response = yield call(api.MainLayout.init, id)

    if (response.ok) {
      const dados = get(response, ['data'], {})
      console.log(dados)
      yield put(Actions.mainLayoutSuccess(dados))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.mainLayoutFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.mainLayoutFailure())
  }
}

/*
export function * inativarAlerta (api, { obj })  {
  try {
    const { id } = getUser();      
    const response = yield call(api.MainLayout.inativarAlerta, {...obj })

    if (response.ok) {
      yield put(Actions.mainLayoutSuccess({
        message: {
          tipo: 'success', descricao: `Registro salvo com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.mainLayoutFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.mainLayoutFailure())
  }
}

export function * marcarLido (api, { obj })  {
  try {
    const { id } = getUser();      
    const response = yield call(api.MainLayout.marcarLido, {...obj, idUsuario: id })

    if (response.ok) {
      yield put(Actions.mainLayoutSuccess({
        message: {
          tipo: 'success', descricao: `Registro salvo com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.mainLayoutFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.mainLayoutFailure())
  }
}*/