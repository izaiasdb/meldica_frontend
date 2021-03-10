import { call, put } from 'redux-saga/effects'
import Action from './redux';
import { get } from "lodash";
import moment from 'moment';

export function * fetch (api)  {
  try {    
      const response = yield call(api.RelatorioOrdemServico.init)

      if (response.ok) {
        const data = get(response, ['data'], {})
        yield put(Action.relatorioResumoMensalSuccess(data))
      } else {
        const { message } = get(response, ['data'], {})
        yield put(Action.relatorioResumoMensalFailure(message))
     }
  } catch (ex) {
    yield put(Action.relatorioResumoMensalFailure())
  }
}

export function * pesquisar (api, { obj })  {
  try {    
    const response = yield call(api.RelatorioOrdemServico.pesquisar, obj)
    
    if (response.ok) {
      const list = get(response, ['data'], {})
      yield put(Action.relatorioResumoMensalSuccess({list}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Action.relatorioResumoMensalFailure(message))
    }
  } catch (ex) {
    yield put(Action.relatorioResumoMensalFailure())
  }
}

export function* imprimir(api, { obj }) {
  try {
    const response = yield call(api.RelatorioOrdemServico.imprimir, obj)
    
    if (response.ok) {
      const report = get(response, ['data'], {})
      const bytes = yield stringToBytes(report);
      const extensao = 'PDF'      
      const date = new moment().format('DDMMYYYY_HHmmss')
      yield saveByteArray(extensao === 'PDF' ? `Resumo_${date}.pdf` : `Pedido_${date}.xls`, bytes, extensao);
      yield put(Action.relatorioResumoMensalSuccess({}))
    } else {
      const { message } = get(response, ['data'], {})
      yield put(Action.relatorioResumoMensalFailure(message))
    }
  } catch (ex) {
    console.log(ex)
    yield put(Action.relatorioResumoMensalFailure())
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