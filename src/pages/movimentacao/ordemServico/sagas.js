import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'

export function * fetch (api)  {
  try {    
      const response = yield call(api.OrdemServico.init)
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.ordemServicoSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.ordemServicoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

export function * pesquisar (api, { ordemServico })  {
  try {    
    const response = yield call(api.OrdemServico.pesquisar, ordemServico)
      if (response.ok) {
        const list = get(response, ['data'], {})
        yield put(Actions.ordemServicoSuccess({list}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.ordemServicoFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

export function * salvar (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    if (!obj.id){
      obj.idUsuarioInclusao = id;
    }

    // const kitProdutoList = yield select((state) => state.ordemServico.kitProdutoList )

    // obj.kitProdutoList = []

    // kitProdutoList.map((item, i)=> {
    //   obj.kitProdutoList.push(item)
    // })
    
    const response = yield call(api.OrdemServico.salvar, {...obj })
    
    if (response.ok) {
      yield put(Actions.ordemServicoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.ordemServicoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

export function * alterarStatus (api, { obj })  {
  try {
    const { id } = getUser();
    obj.idUsuarioAlteracao = id;

    const response = yield call(api.OrdemServico.alterarStatus, {...obj })
    
    if (response.ok) {
      yield put(Actions.ordemServicoSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.ordemServicoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

