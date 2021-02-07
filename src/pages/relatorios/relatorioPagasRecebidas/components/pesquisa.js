import React, { Component } from 'react'
import { Row, Col, Button, Select, Form, DatePicker , Popover } from 'antd'
import { isEqual , mapValues , forEach, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'

import { SEARCHING } from '../../../util/state'
import { generateOptions } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import Action from '../redux'

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

    pesquisar = e => {
        const { tipoTela } = this.props

        this.handleCleanTable();
        e.preventDefault();
        this.props.form.validateFields((err, { obj }) => {
            if (!err) {
                if (isNil(obj.periodo) || obj.periodo.length == 0) {
                    openNotification({tipo: 'warning', descricao: 'Por favor, período deve ser informado.'})
                    return
                }

                if (isEqual(tipoTela, "PAGAR")) {
                    this.props.pesquisar({...obj, receitaDespesa: 'D'})
                } else {
                    this.props.pesquisar({...obj, receitaDespesa: 'R'})
                }
            } else {
                openNotification({ tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.' })
            }
        });
    };

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleCleanTable() {
        const { cleanTable } = this.props
        cleanTable()
    }

    render() {
        const { tipoTerminalList = [], 
            form: { getFieldDecorator }, 
        } = this.props

        const primeiroDiaMes = moment().clone().startOf('month').format('DD/MM/YYYY');
        const ultimoDiaMes   = moment().clone().endOf('month').format('DD/MM/YYYY');
        const dateFormat = 'DD/MM/YYYY'

        return (
            <Form>
                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item label={"Período"} >
                            {
                                getFieldDecorator('obj.periodo', {
                                    rules: [{required: true, message: 'Por favor, informe o período.'}],
                                    initialValue: [moment(primeiroDiaMes, dateFormat), moment(ultimoDiaMes, dateFormat)],
                                })(
                                    <DatePicker.RangePicker format={'DD/MM/YYYY'} moment='YYYY-MM-DD'
                                        onChange={() => this.handleCleanTable()} />
                                )
                            }
                        </Form.Item>
                    </Col>                    
                </Row>
                <Row gutter={12}>
                    <Button type={"primary"}
                        onClick={this.pesquisar}
                        //disabled={!hasAnyAuthority("RELATORIO_TERMINAL_LOG_CONSULTAR")}
                        style={{ marginLeft: '10px' }} >
                        Pesquisar
                    </Button>
                    <Button type={"primary"}
                        style={{ marginLeft: '10px' }}
                        onClick={this.limpar}>
                        Limpar
                    </Button>
                </Row>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioPagasRecebidas.data,
        fetching: state.relatorioPagasRecebidas.fetching,
        profile: state.login.data.profile, 
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Action.relatorioPagasRecebidasCleanTable()),
    pesquisar: (obj) => dispatch(Action.relatorioPagasRecebidasPesquisar(obj)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)