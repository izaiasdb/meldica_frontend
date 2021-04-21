import { call, put, select } from 'redux-saga/effects'
import Actions from './redux';
import { get } from "lodash";
import { getUser } from '../../../services/authenticationService'
import moment from 'moment';

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

export function * obter(api, { id })  {
  try {    
    const response = yield call(api.OrdemServico.obter, id)

    if (response.ok) {
      const ordemServico = get(response, ['data'], {})
      console.log(ordemServico)
      yield put(Actions.ordemServicoSetOrdemServico(ordemServico))
      yield put(Actions.ordemServicoSetKitProdutoList(ordemServico.kitProdutoList))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.ordemServicoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

//*
export function * obterUltimaCompraCliente(api, { idCliente })  {
  try {    
    const response = yield call(api.OrdemServico.obterUltimaCompraCliente, idCliente)

    if (response.ok) {
      const ordemServico = get(response, ['data'], {})
      console.log(ordemServico)
      yield put(Actions.ordemServicoSetOrdemServicoUltimaCompraCliente(ordemServico))
      //yield put(Actions.ordemServicoSetDrawerUltimaCompraClienteVisivel(true)
      //this.props.setDrawerUltimaCompraClienteVisivel(true);
      //yield put(Actions.ordemServicoSetKitProdutoList(ordemServico.kitProdutoList))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.ordemServicoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
} 
//*/

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

export function * gerarFinanceiro (api, { id })  {
  try {
    const response = yield call(api.OrdemServico.gerarFinanceiro, id)
    
    if (response.ok) {
      yield put(Actions.ordemServicoSuccess({
        message: {
          tipo: 'success', descricao: `Registro salvo com sucesso.`
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

export function * deletarFinanceiro (api, { id })  {
  try {
    const response = yield call(api.OrdemServico.deletarFinanceiro, id)
    
    if (response.ok) {
      yield put(Actions.ordemServicoSuccess({
        message: {
          tipo: 'success', descricao: `Registro salvo com sucesso.`
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

export function* imprimir(api, { obj }) {
  try {
    //const { id: idUsuario, unidadeAtual = {} } = getUser();
    //const { id: idUnidade } = unidadeAtual  
    const response = yield call(api.OrdemServico.imprimir, {...obj })
    
    if (response.ok) {
      const report = get(response, ['data'], {})
      const bytes = yield stringToBytes(report);
      const extensao = 'PDF'
      //const { unidadeAtual = {} } = yield select(state => state.login.data.profile)
      const date = new moment().format('DDMMYYYY_HHmmss')
      yield saveByteArray(extensao === 'PDF' ? `Pedido_${date}.pdf` : `Pedido_${date}.xls`, bytes, extensao);
      yield put(Actions.ordemServicoSuccess({}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.ordemServicoFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.ordemServicoFailure())
  }
}

function* stringToBytes(base64) {
  var binaryString = window.atob(base64)
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

function* saveByteArray(reportName, byte, extensao) {
  let blob = null;
  if (extensao === 'PDF') {
    blob = new Blob([byte], { type: "application/pdf" });
  } else {
    blob = new Blob([byte]);
  }
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = reportName;
  link.click();
};