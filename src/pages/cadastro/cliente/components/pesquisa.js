import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'

import Actions from '../redux'
import NumericInput from '../../../util/numericInput'
import { generateOptions, getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
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
        }
    }    

    getExtra = () => {
        return (
            <div>
                <Button 
                    type={"primary"}
                    htmlType={"submit"}
                    onClick={this.handleSubmit}
                    disabled = {!hasAnyAuthority("CLIENTES_CONSULTAR")}>
                    Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={"primary"}
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("CLIENTES_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>
            </div>
        )
    }

    prepareInsert = () => {
        const { setStateView, setCliente } = this.props
        setStateView(INSERTING)
        setCliente(null)        
    }    

    limpar = () => {
        this.setState({ cliente: {} })
        const { cleanTable, form: { resetFields } } = this.props
        resetFields()
        cleanTable()
    }

    handleSubmit = e => {
        this.props.cleanTable()
        e.preventDefault();
        this.props.form.validateFields((err, { cliente }) => {
            if (!err) {
                this.props.pesquisar(cliente)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, 
            ufList = [],
            municipioList = [],
        } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const estado = getFieldValue("cliente.uf")
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Cliente")}
                extra={this.getExtra()}
                style={{ marginBottom: '10px' }}
                >
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('cliente.nome', {
                                    initialValue: null
                                })(
                                    <Input placeholder={"Digite o nome do cliente"} 
                                        maxLength={200} onInput={toInputUppercase} />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={ 4 }>
                        <Form.Item label={"CNPJ / CPF"}>
                            {
                                getFieldDecorator('cliente.cpfCnpj', {
                                    rules: [
                                        { required: false, message: "Por favor, informe um CPF ou CNPJ." },
                                        //{ validator: validarCampoCPF },
                                    ],
                                    initialValue: null
                                })(
                                    <NumericInput maxLength={ 20 } />
                                )
                            }
                        </Form.Item>
                    </Col> 
                </Row>
                <Row gutter={12}>
                    <Col span={ 4 }>
                        <Form.Item label={"Estado/UF"}>
                            {
                                getFieldDecorator('cliente.uf', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {
                                            ufList.map(({id, nome}) => (<Option key={id} value={id} >
                                                {
                                                    `${nome}-${id}`
                                                }
                                            </Option>))
                                        }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 8 }>
                        <Form.Item label={"Município"}>
                            {
                                getFieldDecorator('cliente.cidade', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {
                                            estado && 
                                            municipioList.filter(({uf}) => uf.id == estado)
                                                    .map(({nome}) => 
                                                        (<Option key={nome} value={nome} >
                                                            {
                                                                `${nome}`
                                                            }
                                                        </Option>))
                                        }
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
        ...state.cliente.data,
        fetching: state.cliente.fetching,
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Actions.clienteCleanTable()),
    cleanMessage: ()  => dispatch(Actions.clienteCleanMessage()),
    pesquisar: (cliente) => dispatch(Actions.clientePesquisar(cliente)),
    setCliente: (cliente) => dispatch(Actions.clienteSetCliente(cliente)),
    setStateView: (stateView) => dispatch(Actions.clienteSetStateView(stateView)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)