import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { get, isEmpty } from "lodash"

import { openNotification } from '../../../util/notification'
import Pesquisa from '../components/pesquisa'
import Tabela from '../components/tabela'
import Action from '../redux'

class Relatorio extends Component {

    UNSAFE_componentWillMount(){
        this.props.cleanTable()
        this.props.init()
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")
        
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
        }
    }

    render() {
        const { fetching, tipoTela } = this.props
        return (<Spin spinning={ fetching }>
            <Pesquisa />
            <Tabela />
        </Spin>)
    }

}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioResumoMensal.data,
        fetching: state.relatorioResumoMensal.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Action.relatorioResumoMensalInit()),
    cleanMessage: ()  => dispatch(Action.relatorioResumoMensalCleanMessage()),
    cleanTable: () => dispatch(Action.relatorioResumoMensalCleanTable()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Relatorio)