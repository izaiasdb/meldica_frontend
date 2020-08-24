import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
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
        }
    }    

    getExtra = () => {
        return (
            <div>
                <Button type={"primary"}
                        htmlType={"submit"}
                        onClick={this.handleSubmit}
                        disabled = {!hasAnyAuthority("FORNECEDORES_CONSULTAR")}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={"primary"}
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("FORNECEDORES_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>
            </div>
        )
    }

    prepareInsert = () => {
        const { setStateView, setFornecedor } = this.props
        setStateView(INSERTING)
        setFornecedor(null)        
    }    

    limpar = () => {
        this.setState({ fornecedor: {} })
        const { cleanTable, form: { resetFields } } = this.props
        resetFields()
        cleanTable()
    }

    handleSubmit = e => {
        this.props.cleanTable()
        e.preventDefault();
        this.props.form.validateFields((err, { fornecedor }) => {
            if (!err) {
                this.props.pesquisar(fornecedor)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Fornecedor")}
                extra={this.getExtra()}
                style={{ marginBottom: '10px' }}
                >
                <Row gutter={12}>
                    <Col span={10}>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('fornecedor.nome', {
                                    initialValue: null
                                })(
                                    <Input placeholder={"Digite o nome do fornecedor"} 
                                        maxLength={200} onInput={toInputUppercase} />
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
        ...state.fornecedor.data,
        fetching: state.fornecedor.fetching,
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Actions.fornecedorCleanTable()),
    cleanMessage: ()  => dispatch(Actions.fornecedorCleanMessage()),
    pesquisar: (fornecedor) => dispatch(Actions.fornecedorPesquisar(fornecedor)),
    setFornecedor: (fornecedor) => dispatch(Actions.fornecedorSetFornecedor(fornecedor)),
    setStateView: (stateView) => dispatch(Actions.fornecedorSetStateView(stateView)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)