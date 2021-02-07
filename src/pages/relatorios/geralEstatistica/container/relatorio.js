import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHeader } from '../../../util/helper'
import { Card, Spin } from 'antd'
import { isEqual } from 'lodash'

import Pesquisa from '../components/pesquisa'
import Action from '../redux'
import RelatorioPagarReceber from '../../relatorioPagarReceber/container/relatorioPagarReceber'
import RelatorioPagasRecebidas from '../../relatorioPagasRecebidas/container/relatorioPagasRecebidas'

import {
    SEARCHING,
    STATE_RELATORIO_CONTAS_A_PAGAR,
    STATE_RELATORIO_CONTAS_A_RECEBER,
    STATE_RELATORIO_CONTAS_PAGAS,
    STATE_RELATORIO_CONTAS_RECEBIDAS,    
} from '../../../util/state'

class Relatorio extends Component {

    componentDidMount() {
        this.props.init()
    }

    componentWillUnmount() {
        this.props.setState(SEARCHING);
    }

    getTitleTela = () => {
        const { state } = this.props
        return (
            <>
                {isEqual(state, SEARCHING) && 
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {'Relatórios'}
                    </span>
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_A_PAGAR) && 
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {'Relatório Balancete Contas à Pagar'}
                    </span>
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_PAGAS) &&
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {'Relatório Balancete Contas Pagas'}
                    </span>
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_A_RECEBER) && 
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {'Relatório Balancete Contas à Receber'}
                    </span>
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_RECEBIDAS) &&
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {'Relatório Balancete Contas Recebidas'}
                    </span>
                }

            </>
        )
    }



    render() {
        const { state, fetching } = this.props
        return (<Spin spinning={fetching}>
            {getHeader('Relatórios')}

            <Card title={this.getTitleTela()}
                style={{ marginBottom: '10px' }}>

                <Pesquisa />

                {isEqual(state, STATE_RELATORIO_CONTAS_A_PAGAR) &&
                    <RelatorioPagarReceber tipoTela={"PAGAR"} />
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_A_RECEBER) &&
                    <RelatorioPagarReceber tipoTela={"RECEBER"} />
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_PAGAS) &&
                    <RelatorioPagasRecebidas tipoTela={"PAGAS"} />
                }

                {isEqual(state, STATE_RELATORIO_CONTAS_RECEBIDAS) &&
                    <RelatorioPagasRecebidas tipoTela={"RECEBIDAS"} />
                }                
            </Card>

        </Spin>)
    }

}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioGeral.data,
        fetching: state.relatorioGeral.fetching,
        state: state.relatorioGeral.state,
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: () => dispatch(Action.relatorioGeralInit()),
    cleanMessage: () => dispatch(Action.relatorioGeralCleanMessage()),
    clean: () => dispatch(Action.relatorioGeralClean()),
    setState: (state) => dispatch(Action.relatorioGeralSetState(state)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Relatorio)