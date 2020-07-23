import { call, put } from 'redux-saga/effects'
import LoginActions from './redux';
import { get } from "lodash";
import { login, logout as _logout, getUser } from '../../services/authenticationService'

export function * logar (api, { credenciais })  {
  try {    
      const response = yield call(api.Login.logar, credenciais)
      if (response.ok) {
        let profile = get(response, ['data'], {})        
        yield new Promise((resolve) => { login(profile); resolve(); })
        yield put(LoginActions.loginSuccess({profile}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(LoginActions.loginFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(LoginActions.loginFailure())
  }
}

export function * esqueciSenha (api, { credenciais })  {
  try {    
      const response = yield call(api.Login.esqueciSenha, credenciais)
      if (response.ok) {
        yield put(LoginActions.loginSuccess({
          message: {
            tipo: 'success', descricao: `E-mail enviado com sucesso.`
          }
        }))        
      } else {
        const { message } = get(response, ['data'], {})
        yield put(LoginActions.loginFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(LoginActions.loginFailure())
  }
}

export function * alterarSenha (api, { credenciais })  {
  try {    
      const response = yield call(api.Login.alterarSenha, credenciais)
      if (response.ok) {
        yield put(LoginActions.loginSuccess({
          message: {
            tipo: 'success', descricao: `Senha alterada com sucesso.`
          }
        }))        
      } else {
        const { message } = get(response, ['data'], {})
        yield put(LoginActions.loginFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(LoginActions.loginFailure())
  }
}

export function * logout ()  {
  try {   
      yield new Promise((resolve) => {_logout(); resolve() })
      yield put(LoginActions.loginCleanProfile())
  } catch (ex) {
    console.log(ex)
    yield put(LoginActions.loginFailure())
  }
}

export function * refresh ()  {
  try {    
    let profile = getUser()
    yield new Promise((resolve) => { login(profile); resolve(); })
    yield put(LoginActions.loginSuccess({profile}))
  } catch (ex) {
    console.log(ex)
    yield put(LoginActions.loginFailure())
  }
}
