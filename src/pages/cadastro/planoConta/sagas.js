import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import Actions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.PlanoConta.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.planoContaSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.planoContaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.planoContaFailure())
  }
}

export function * pesquisar (api, { planoConta })  {
  try {    
    const response = yield call(api.PlanoConta.pesquisar, planoConta)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(Actions.planoContaSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.planoContaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.planoContaFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }  
      
    const response = yield call(api.PlanoConta.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(Actions.planoContaSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.planoContaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.planoContaFailure())
  }
}
/*
export function * pesquisarPlanoConta (api, { id })  {
  try {    
      const response = yield call(api.PlanoConta.pesquisarPlanoConta, id)
      if (response.ok) {
        const dados = get(response, ['data'], {})
        yield put(Actions.planoContaSuccess({dados}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.planoContaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.planoContaFailure())
  }
}*/
