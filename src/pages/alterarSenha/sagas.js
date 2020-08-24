import { call, put } from 'redux-saga/effects'
import AlterarSenhaActions from './redux';

export function * salvar (api, { obj })  {
    try {
        const response = yield call(api.AlterarSenha.salvar, obj )
  
        if (response.ok) {
            yield put(AlterarSenhaActions.alterarSenhaSuccess({
            message: {
                tipo: 'success', descricao: `Registro ${obj && obj.id ? 'alterado' : 'salvo'} com sucesso.`
            }
            }))
        } else {
            const { message } = get(response, ['data'], {})
            yield put(AlterarSenhaActions.alterarSenhaFailure(message))
        }
    } catch (ex) {
        console.log(ex)
        yield put(AlterarSenhaActions.alterarSenhaFailure())
    }
}