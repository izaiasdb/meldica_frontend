import React, { Component } from 'react'
import { Row , Col , TreeSelect , Form } from 'antd'
import { isEqual } from 'lodash'
import { connect } from 'react-redux'

import { hasAnyAuthority } from '../../../../services/authenticationService'
import {
    SEARCHING,
    STATE_RELATORIO_CONTAS_A_PAGAR,
    STATE_RELATORIO_CONTAS_A_RECEBER,
    STATE_RELATORIO_CONTAS_PAGAS,
    STATE_RELATORIO_CONTAS_RECEBIDAS,
    STATE_RELATORIO_RESUMO_MENSAL,
    STATE_RELATORIO_LISTAGEM_VENDA,
    STATE_RELATORIO_PRODUZIR,
} from '../../../util/state'
import Action from '../redux'

const { TreeNode } = TreeSelect;

class Pesquisa extends Component {

    componentDidMount() {
        const { state, form: { setFieldsValue }, obj } = this.props
        if (isEqual(state, SEARCHING)) {
            setFieldsValue({
                obj: {
                    ...obj
                }
            })
        }
    }

    handleTipoRelatorio(value) {
        switch (value) {
            case 1:
                this.props.setState(STATE_RELATORIO_CONTAS_A_PAGAR);
                break;
            case 2:
                this.props.setState(STATE_RELATORIO_CONTAS_PAGAS);
                break;                
            case 3:
                this.props.setState(STATE_RELATORIO_CONTAS_A_RECEBER);
                break;
            case 4:
                this.props.setState(STATE_RELATORIO_CONTAS_RECEBIDAS);
                break;
            case 5:
                this.props.setState(STATE_RELATORIO_RESUMO_MENSAL);
                break;
            case 7:
                this.props.setState(STATE_RELATORIO_LISTAGEM_VENDA);
                break;
            case 8:
                this.props.setState(STATE_RELATORIO_PRODUZIR);
                break;
                
            default:
                this.props.setState(SEARCHING);
        }
    }

    render() {
        const { tiposRelatorios = [], form: { getFieldDecorator } } = this.props
        return (
            <Form>
                <Row gutter={ 12 }>
                    <Col span={ 12 }>
                        <Form.Item label={"Escolha o relat??rio "} >
                            {
                                getFieldDecorator('obj.tipoRelatorio', {
                                    initialValue: []
                                })(
                                    <TreeSelect
                                        showSearch allowClear
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Por favor escolha o tipo de relat??rio"
                                        onChange={(value) => this.handleTipoRelatorio(value)}
                                        treeDefaultExpandAll={true} >

                                            <TreeNode value={0} title="RELAT??RIOS FINANCEIRO">
                                                <TreeNode value={1} title="RELAT??RIO BALANCETE CONTAS ?? PAGAR" //disabled={!hasAnyAuthority("RELATORIO_ATENDIMENTO_MEDICO_CONSULTAR")} 
                                                />
                                                <TreeNode value={2} title="RELAT??RIO BALANCETE CONTAS PAGAS" //disabled={!hasAnyAuthority("RELATORIO_ATENDIMENTO_MEDICO_CONSULTAR")} 
                                                />
                                                <TreeNode value={3} title="RELAT??RIO BALANCETE CONTAS ?? RECEBER" //disabled={!hasAnyAuthority("RELATORIO_ATENDIMENTO_MEDICO_CONSULTAR")} 
                                                />
                                                <TreeNode value={4} title="RELAT??RIO BALANCETE CONTAS RECEBIDAS" //disabled={!hasAnyAuthority("RELATORIO_ATENDIMENTO_MEDICO_CONSULTAR")} 
                                                />                                                
                                            </TreeNode>

                                            <TreeNode value={6} title="RELAT??RIOS PEDIDO">
                                                <TreeNode value={5} title="RELAT??RIO RESUMO MENSAL" //disabled={!hasAnyAuthority("RELATORIO_ATENDIMENTO_MEDICO_CONSULTAR")} 
                                                />
                                                <TreeNode value={7} title="RELAT??RIO LISTGAGEM VENDA" />
                                                <TreeNode value={8} title="RELAT??RIO PRODUZIR" />
                                            </TreeNode>                                            
{/* 
                                            <TreeNode value={18} title="RELAT??RIOS POPULA????O CARCER??RIA" >
                                                <TreeNode value={1} title="RELAT??RIO POPULA????O CARCER??RIA GERAL" disabled={!hasAnyAuthority("RELATORIO_POPULACAO_CARCERARIA_CONSULTAR")} />
                                                <TreeNode value={2} title="RELAT??RIO POPULA????O CARCER??RIA RESUMO" disabled={!hasAnyAuthority("RELATORIO_RESUMO_POPULACAO_CARCERARIA_CONSULTAR")} />
                                                <TreeNode value={12} title="RELAT??RIO POPULA????O CARCER??RIA REINCID??NCIA" disabled={!hasAnyAuthority("RELATORIO_REINCIDENCIA_CONSULTAR")} />
                                            </TreeNode>

                                            <TreeNode value={15} title="RELAT??RIO ANEXOS" disabled={!hasAnyAuthority("RELATORIO_ANEXO_CONSULTAR")} />
                                            <TreeNode value={3} title="RELAT??RIO BIOMETRIA" disabled={!hasAnyAuthority("ESTATISTICAS_CONSULTAR")} />
                                            <TreeNode value={4} title="RELAT??RIO DEPEN CRIMES" disabled={!hasAnyAuthority("RELATORIO_DEPEN_CRIME_CONSULTAR")} /> */}
                                    </TreeSelect>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
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
    cleanMessage: () => dispatch(Action.relatorioGeralCleanMessage()),
    setState: (value) => dispatch(Action.relatorioGeralSetState(value)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)