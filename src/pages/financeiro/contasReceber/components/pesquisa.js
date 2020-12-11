import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty, isEqual } from 'lodash'
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

    getExtra = () => {
        return (
            <div>
                <Button type={"primary"}
                        htmlType={"submit"}
                        onClick={this.handleSubmit}
                        disabled = {!hasAnyAuthority("CONTAS_RECEBER_CONSULTAR")}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={"primary"}
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("CONTAS_RECEBER_INSERIR")}
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
        this.props.cleanTable()
        e.preventDefault();
        this.props.form.validateFields((err, { contasReceber }) => {
            if (!err) {
                this.props.pesquisar(contasReceber)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, clienteList = [], } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Contas a Receber")}
                extra={this.getExtra()}
                style={{ marginBottom: '10px' }}
                >
                <Row gutter={12}>
                    {/* <Col span={4}>
                        <Form.Item label={"Tipo Ordem de Serviço"}>
                            {
                                getFieldDecorator('contasReceber.tipo', {
                                    initialValue: null
                                })(
                                    <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'A'}>{"ABERTA"}</Option>
                                        <Option key={3} value={'P'}>{"PAGA"}</Option>
                                        <Option key={3} value={'C'}>{"CANCELADA"}</Option>
                                        <Option key={3} value={'G'}>{"GRÁTIS"}</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>   */}
                    <Col span={ 16 }>
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
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Actions.contasReceberCleanTable()),
    cleanMessage: ()  => dispatch(Actions.contasReceberCleanMessage()),
    pesquisar: (contasReceber) => dispatch(Actions.contasReceberPesquisar(contasReceber)),
    setContasReceber: (contasReceber) => dispatch(Actions.contasReceberSetContasReceber(contasReceber)),
    setStateView: (stateView) => dispatch(Actions.contasReceberSetStateView(stateView)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)