import { call, put } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import MenuActions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Menu.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(MenuActions.menuSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(MenuActions.menuFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(MenuActions.menuFailure())
  }
}

export function * pesquisar (api, { menu })  {
  try {    
    const response = yield call(api.Menu.pesquisar, menu)

      if (response.ok) {
        const list = get(response, ['data'], {})        
        yield put(MenuActions.menuSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(MenuActions.menuFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(MenuActions.menuFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }  
      
    const response = yield call(api.Menu.salvar, {...obj, dataInclusao: null, dataAlteracao: null})

    if (response.ok) {
      yield put(MenuActions.menuSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(MenuActions.menuFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(MenuActions.menuFailure())
  }
}

export function * pesquisarMenu (api, { id })  {
  try {    
      const response = yield call(api.Menu.pesquisarMenu, id)
      if (response.ok) {
        const dados = get(response, ['data'], {})
        yield put(MenuActions.menuSuccess({dados}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(MenuActions.menuFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(MenuActions.menuFailure())
  }
}
