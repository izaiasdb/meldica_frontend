import { call, put } from 'redux-saga/effects'
import DashboardActions from './redux';
import { get } from "lodash";
import { USER_KEY } from '../../services/authenticationService'

export function * getPopulacaoTotal ( api )  {
  try {
    const response = yield call(api.Dashboard.getPopulacaoTotal)
      if (response.ok) {
        let dados = get(response, ['data'], {})
        yield put(DashboardActions.dashboardSuccess({populacaoTotal: dados}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(DashboardActions.dashboardFailure(message))
     }

  } catch (ex) {
    console.log(ex)
    yield put(DashboardActions.dashboardFailure())
  }
}

export function * getTotalColaboradorPorTipo ( api )  {
  try {    
    const response = yield call(api.Dashboard.getTotalColaboradorPorTipo)
      if (response.ok) {
        let dados = get(response, ['data'], {})
        yield put(DashboardActions.dashboardSuccess({totalColaboradorPorTipo: dados}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(DashboardActions.dashboardFailure(message))
     }

  } catch (ex) {
    console.log(ex)
    yield put(DashboardActions.dashboardFailure())
  }
}

export function * getPopulacaoTotalPorUnidade ( api )  {
  try {
    let user = localStorage.getItem(USER_KEY)
    let { unidades } = JSON.parse(user)
    var unds = '';

    unidades.map((unidade, index) => {
      if (index == 0)
        unds += unidade.id
      else  
        unds += ',' + unidade.id 
    });

    let response = yield call(api.Dashboard.getPopulacaoTotalPorUnidade, unds)    
    
    if (response.ok) {
      let dados = get(response, ['data'], {})
      yield put(DashboardActions.dashboardSuccess({populacaoTotalPorUnidade: dados}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(DashboardActions.dashboardFailure(message))
    }

  } catch (ex) {
    console.log(ex)
    yield put(DashboardActions.dashboardFailure())
  }
}

export function * pesquisarMensagemUnidade ( api, { obj })  {
  try {    
    const response = yield call(api.Dashboard.pesquisarMensagemUnidade, obj)

      if (response.ok) {
        const mensagemUnidade = get(response, ['data'], {})
        yield put(DashboardActions.dashboardSuccess({mensagemUnidade}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(DashboardActions.dashboardFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(DashboardActions.dashboardSuccess())
  }
}
