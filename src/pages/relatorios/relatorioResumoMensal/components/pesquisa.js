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
        this.handleCleanTable();
        e.preventDefault();
        this.props.form.validateFields((err, { obj }) => {
            if (!err) {
                if (isNil(obj.periodoVenda) || obj.periodoVenda.length == 0) {
                    openNotification({tipo: 'warning', descricao: 'Por favor, período deve ser informado.'})
                    return
                }

                //this.props.pesquisar(obj)
                this.props.imprimir(obj)                
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
        const { 
            form: { getFieldDecorator }, 
            list = [],
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
                                getFieldDecorator('obj.periodoVenda', {
                                    rules: [{required: true, message: 'Por favor, informe o período.'}],
                                    initialValue: [moment(primeiroDiaMes, dateFormat), moment(ultimoDiaMes, dateFormat)],
                                })(
                                    <DatePicker.RangePicker format={'DD/MM/YYYY'} moment='YYYY-MM-DD'
                                        onChange={() => this.handleCleanTable()} />
                                )
                            }
                        </Form.Item>
                    </Col> 
                     <Col span={4}>
                        <Form.Item label={"Tipo Relatório"}>
                            {
                                getFieldDecorator('obj.tipoRelatorio', {
                                    rules: [{required: true, message: 'Por favor, informe o tipo do relatório.'}],
                                    initialValue: null
                                })(
                                    <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'N'}>{"MÉLDICA NATURAIS E ENCAPSULADOS"}</Option>
                                        <Option key={3} value={'C'}>{"MÉLDICA COSMÉTICOS"}</Option>
                                    </Select>
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
                        Imprimir
                    </Button>
                    <Button type={"primary"}
                        style={{ marginLeft: '10px' }}
                        onClick={this.limpar}>
                        Limpar
                    </Button>
                    {/* <Button type={"primary"}
                        style={{ marginLeft: '10px' }}
                        disabled={}
                        onClick={this.limpar}>
                        Imprimir
                    </Button>                     */}
                </Row>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioResumoMensal.data,
        fetching: state.relatorioResumoMensal.fetching,
        profile: state.login.data.profile, 
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Action.relatorioResumoMensalCleanTable()),
    pesquisar: (obj) => dispatch(Action.relatorioResumoMensalPesquisar(obj)),
    imprimir: (obj) => dispatch(Action.relatorioResumoMensalImprimir(obj)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)