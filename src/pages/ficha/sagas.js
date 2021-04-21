import { call, put, select } from 'redux-saga/effects'
import { get } from "lodash";
import moment from 'moment';

import Actions from './redux';
import { getUser } from '../../services/authenticationService';

export function * getDados (api, { id: idPessoa, idTipoPessoa })  {
  try {    
      const { id: idUsuario, unidadeAtual = {} } = getUser();
      const { id: idUnidade } = unidadeAtual
      const response = yield call(api.FichaPessoa.getDados, { idPessoa, idTipoPessoa, idUnidade, idUsuario, idOrigem: 1 })
      
      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Actions.fichaPessoaSuccess({dados: data}))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Actions.fichaPessoaFailure(message))
     }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getCliente (api, { id })  {
  try {  
    console.log(id)
    const response = yield call(api.Cliente.obterFicha, id)

    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getServidor (api, { id: idPessoa })  {
  try {  
    const response = yield call(api.Servidor.getServidor, { idPessoa })
    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getTerceirizado (api, { id: idPessoa })  {
  try {  
    const response = yield call(api.Terceirizado.getTerceirizado, { idPessoa })
    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getPrestadorServico (api, { id: idPessoa })  {
  try {
    const { id: idUsuario, unidadeAtual = {} } = getUser();
    const { id: idUnidade } = unidadeAtual
    const response = yield call(api.PrestadorServico.getPrestadorServico, { idPessoa, idUsuario, idUnidade, idOrigem: 1 })

    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getVisitante (api, { id: idPessoa })  {
  try { 
    const { id: idUsuario, unidadeAtual = {} } = getUser();
    const { id: idUnidade } = unidadeAtual
    const response = yield call(api.Visitante.getVisitante, { idPessoa, idUsuario, idUnidade, idOrigem: 1 })    

    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * getVisitanteUnidade (api, { id: idPessoa })  {
  try { 
    const { id: idUsuario, unidadeAtual = {} } = getUser();
    const { id: idUnidade } = unidadeAtual
    const response = yield call(api.VisitanteUnidade.getVisitanteUnidade, { idPessoa, idUsuario, idUnidade, idOrigem: 1 })    

    if (response.ok) {
      const data = get(response, ['data'], {})
      yield put(Actions.fichaPessoaSuccess({dados: data}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function * alterarFoto (api, { obj })  {
  try {
    const response = yield call(api.FichaPessoa.alterarFoto, obj)
    
    if (response.ok) {
      yield put(Actions.fichaPessoaSuccess({
        message: {
          tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
        }
      }))
      // Refresh na página
      window.location.reload(false);
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
  }
}

export function* imprimir(api, { id: idPessoa, idTipoPessoa }) {
  try {    
    const { id: idUsuario, unidadeAtual = {} } = getUser();
    const { id: idUnidade } = unidadeAtual
    const response = yield call(api.FichaPessoa.imprimir, { idPessoa, idTipoPessoa, idUnidade, idUsuario, idOrigem: 1 })
    
    if (response.ok) {
      const report = get(response, ['data'], {})
      const bytes = yield stringToBytes(report);
      const extensao = 'PDF'
      const { unidadeAtual = {} } = yield select(state => state.login.data.profile)
      const date = new moment().format('DDMMYYYY_HHmmss')
      yield saveByteArray(extensao === 'PDF' ? `FichaPessoa_${date}_${unidadeAtual.abreviacao}.pdf` : `FichaPessoa_${date}_${unidadeAtual.abreviacao}.xls`, bytes, extensao);
      yield put(Actions.fichaPessoaSuccess({}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Actions.fichaPessoaFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Actions.fichaPessoaFailure())
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