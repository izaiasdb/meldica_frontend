import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty, isEqual } from 'lodash'
import moment from 'moment'

import { generateOptions, getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import Actions from '../redux'
import { INSERTING } from '../../../util/state'
 
const Option = Select.Option

class Pesquisa extends Component {

    constructor(props) {
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")
        
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()

            if (isEqual(message.descricao, 'Registro alterado com sucesso.')){
                this.props.cleanTable();
            }
        }
    }  

    getExtra = (tipoTela) => {
        return (
            <div>
                <Button type={"primary"}
                        htmlType={"submit"}
                        onClick={this.handleSubmit}
                        disabled = {isEqual(tipoTela, 'PAGAR') ? !hasAnyAuthority("CONTAS_PAGAR_CONSULTAR") : !hasAnyAuthority("CONTAS_RECEBER_CONSULTAR")}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={"primary"}
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {isEqual(tipoTela, 'PAGAR') ? !hasAnyAuthority("CONTAS_PAGAR_INSERIR") : !hasAnyAuthority("CONTAS_RECEBER_CONSULTAR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>
            </div>
        )
    }

    prepareInsert = () => {
        const { setStateView, setContasReceber } = this.props
        setStateView(INSERTING)
        setContasReceber(null)        
    }    

    limpar = () => {
        this.setState({ contasReceber: {} })
        const { cleanTable, form: { resetFields } } = this.props
        resetFields()
        cleanTable()
    }

    handleSubmit = e => {
        const { tipoTela} = this.props

        this.props.cleanTable()
        e.preventDefault();
        this.props.form.validateFields((err, { contasReceber }) => {
            if (!err) {
                if (isEqual(tipoTela, 'PAGAR')) {
                    this.props.pesquisarPagar(contasReceber)
                } else {
                    this.props.pesquisarReceber(contasReceber)
                }
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, 
            clienteList = [], 
            fornecedorList = [], 
            planoContaList = [],
            tipoTela} = this.props
        const { getFieldDecorator, getFieldValue } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        
        const primeiroDiaMes = moment().clone().startOf('month').format('DD/MM/YYYY');
        const ultimoDiaMes   = moment().clone().endOf('month').format('DD/MM/YYYY');
        const dateFormat = 'DD/MM/YYYY'

        return (
            <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle(`Pesquisa Contas a ${isEqual(tipoTela, 'PAGAR') ? 'Pagar': 'Receber'}`)}
                extra={this.getExtra(tipoTela)}
                style={{ marginBottom: '10px' }}
                >
                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item label={"Período"} >
                            {
                                getFieldDecorator('contasReceber.periodoVencimento', {
                                    initialValue: [moment(primeiroDiaMes, dateFormat), moment(ultimoDiaMes, dateFormat)],
                                    rules: [{required: false, message: 'Por favor, informe um período.'}],
                                })(
                                    <DatePicker.RangePicker 
                                        format={'DD/MM/YYYY'} 
                                        moment='YYYY-MM-DD'
                                        //defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                                        //onChange={() => this.handleCleanTable()} 
                                        />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label={"Tipo"}>
                            {
                                getFieldDecorator('contasReceber.status', {
                                    initialValue: null
                                })(
                                    <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'A'}>{"ABERTA"}</Option>
                                        <Option key={3} value={'P'}>{"PAGA"}</Option>
                                        {/* <Option key={3} value={'C'}>{"CANCELADA"}</Option>
                                        <Option key={3} value={'G'}>{"GRÁTIS"}</Option> */}
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={ 3 }>
                        <Form.Item label={"Competência"}>
                            {
                                getFieldDecorator('contasReceber.competencia', {
                                    rules: [{required: false, message: 'Por favor, informe o cliente.'}],
                                })(
                                    <Input 
                                        placeholder={"Competência"} 
                                        maxLength={6} 
                                    />
                                )
                            }
                        </Form.Item>
                    </Col>                                         
                </Row>
                <Row gutter={12}>
                    <Col span={ 12 }>
                        { isEqual(tipoTela, 'RECEBER') &&
                        <Form.Item label={"Cliente"}>
                            {
                                getFieldDecorator('contasReceber.cliente.id', {
                                    rules: [{required: false, message: 'Por favor, informe o cliente.'}],
                                    //initialValue: isNil(cliente) ? null : cliente.id
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {generateOptions(clienteList)}
                                </Select>
                                )
                            }
                        </Form.Item>
                        }
                        { isEqual(tipoTela, 'PAGAR') &&
                        <Form.Item label={"Fornecedor"}>
                            {
                                getFieldDecorator('contasReceber.fornecedor.id', {
                                    rules: [{required: false, message: 'Por favor, informe o Fornecedor.'}],
                                    //initialValue: isNil(cliente) ? null : cliente.id
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {generateOptions(fornecedorList)}
                                </Select>
                                )
                            }
                        </Form.Item>
                        }                        
                    </Col>  
                    <Col span={ 12 }>
                        <Form.Item label={"Plano de conta"}>
                            {
                                getFieldDecorator('contasReceber.planoConta.id', {
                                    rules: [{required: false, message: 'Por favor, informe o cliente.'}],
                                    //initialValue: isNil(cliente) ? null : cliente.id
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {generateOptions(planoContaList)}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>                                                                          
                </Row>
            </Card>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.contasReceber.data,
        fetching: state.contasReceber.fetching,
        //tipoTela: state.contasReceber.tipoTela,
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Actions.contasReceberCleanTable()),
    cleanMessage: ()  => dispatch(Actions.contasReceberCleanMessage()),
    pesquisarReceber: (contasReceber) => dispatch(Actions.contasReceberPesquisarReceber(contasReceber)),
    pesquisarPagar: (contasReceber) => dispatch(Actions.contasReceberPesquisarPagar(contasReceber)),
    setContasReceber: (contasReceber) => dispatch(Actions.contasReceberSetContasReceber(contasReceber)),
    setStateView: (stateView) => dispatch(Actions.contasReceberSetStateView(stateView)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)