import { call, put } from 'redux-saga/effects'
import MensagemDashboardActions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function* fetch(api) {
  try {
    const response = yield call(api.MensagemDashboard.init)
    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(MensagemDashboardActions.mensagemDashboardSuccess(data))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(MensagemDashboardActions.mensagemDashboardFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(MensagemDashboardActions.mensagemDashboardFailure())
  }
}

export function* pesquisar(api, { obj }) {
  try {
    const response = yield call(api.MensagemDashboard.pesquisar, obj)
    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(MensagemDashboardActions.mensagemDashboardSuccess({ list }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(MensagemDashboardActions.mensagemDashboardFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(MensagemDashboardActions.mensagemDashboardFailure())
  }
}

export function* salvar(api, { obj }) {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }    

    const response = yield call(api.MensagemDashboard.salvar, obj)
    if (response.ok) {
      yield put(MensagemDashboardActions.mensagemDashboardSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(MensagemDashboardActions.mensagemDashboardFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(MensagemDashboardActions.mensagemDashboardFailure())
  }
}
