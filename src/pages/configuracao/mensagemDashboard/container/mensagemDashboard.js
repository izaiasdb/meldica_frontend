import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty, get, isEqual } from 'lodash'
import MensagemDashboardActions from '../redux'
import Pesquisa from '../components/pesquisa'
import Tabela from '../components/tabela'
import Formulario from '../components/formulario'
import { getHeader } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { Spin } from 'antd'
import { SEARCHING, EDITING, INSERTING } from '../../../util/state'

class MensagemDashboard extends Component {

    UNSAFE_componentWillReceiveProps(nextProps) {
        const message = get(nextProps, ['message'], "")
        if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
        }
    }

    render() {
        const { fetching, state } = this.props
        return (<Spin spinning={fetching}>
            { getHeader('Mensagem') }
            {
                isEqual(state, SEARCHING) &&
                <div>
                    <Pesquisa />
                    <Tabela />
                </div>
            }
            {
                (isEqual(state, INSERTING) || isEqual(state, EDITING)) &&
                <div>
                    <Formulario />
                </div>
            }
        </Spin>)
    }

}

const mapStateToProps = (state) => {
    return {
        ...state.mensagemDashboard.data,
        fetching: state.mensagemDashboard.fetching,
        state: state.mensagemDashboard.state,
        obj: state.mensagemDashboard.obj
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: () => dispatch(MensagemDashboardActions.mensagemDashboardInit()),
    cleanMessage: () => dispatch(MensagemDashboardActions.mensagemDashboardCleanMessage()),
    salvar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardSalvar(obj)),
    clean: () => dispatch(MensagemDashboardActions.mensagemDashboardClean()),
    setState: (state) => dispatch(MensagemDashboardActions.mensagemDashboardSetState(state)),
    setMensagemDashboard: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardSetMensagemDashboard(obj)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MensagemDashboard)