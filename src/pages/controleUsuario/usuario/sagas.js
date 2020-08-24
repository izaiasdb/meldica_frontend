import { call, put, select } from 'redux-saga/effects'
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import UsuarioActions from './redux';

export function * fetch (api)  {
  try {    
      const response = yield call(api.Usuario.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(UsuarioActions.usuarioFailure())
  }
}

export function * pesquisar (api, { usuario })  {
  try {    
    const response = yield call(api.Usuario.pesquisar, usuario)

      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(UsuarioActions.usuarioFailure())
  }
}

export function * salvar (api, { obj })  {
  try {        
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }    

    const checkedKeys = yield select((state) => state.usuario.checkedKeys )
    const unidadeIds = yield select((state) => state.usuario.unidadeIds )
    const { unidadeAtual: unidade } = yield select((state) => state.login.data.profile )
    const response = yield call(api.Usuario.salvar, {
      ...obj, 
      dataInclusao: null, 
      dataAlteracao: null, 
      permissoes: checkedKeys, 
      unidadeIds: unidadeIds, 
      unidade 
    })      

    if (response.ok) {
      yield put(UsuarioActions.usuarioSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(UsuarioActions.usuarioFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(UsuarioActions.usuarioFailure())
  }
}

export function * getPerfilPermissoes (api, { id })  {
  try {    
    const response = yield call(api.Usuario.getPerfilPermissoes, id)

      if (response.ok) {
        const permissoes = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioSetCheckedKeys(permissoes))
        yield put(UsuarioActions.usuarioSuccess({permissoes}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(UsuarioActions.usuarioFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(UsuarioActions.usuarioFailure())
  }
}