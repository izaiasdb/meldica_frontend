import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, Divider } from 'antd'
import { connect } from 'react-redux'
import { generateOptions, getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import { INSERTING } from '../../../util/state'
import Actions from '../redux'

const Option = Select.Option

class Pesquisa extends Component {
    
    constructor(props){
        super(props)
    }

    componentDidMount() {
        //this.props.init()
    }    

    getExtra = () => {
        return (
            <div>
                <Button type={ "primary"}
                        htmlType="submit"
                        disabled = {!hasAnyAuthority("FORMAS_DE_PAGAMENTO_CONSULTAR")}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '10px' }}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />                
                <Button type={ "primary"} 
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("FORMAS_DE_PAGAMENTO_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>                  
            </div>
        )
    }


    prepareInsert = () => {
        this.props.setStateView(INSERTING)
        this.props.setFormaPagamento(null)
    }    

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { formaPagamento }) => {
            if (!err) {
                this.props.pesquisar(formaPagamento)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa")} 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('formaPagamento.nome', {
                                    initialValue: null
                                })(
                                    <Input maxLength={ 200 } onInput={toInputUppercase} />
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
        ...state.formaPagamento.data,
        fetching: state.formaPagamento.fetching,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.formaPagamentoInit()),
    cleanTable: () => dispatch(Actions.formaPagamentoCleanTable()),
    setFormaPagamento: () => dispatch(Actions.formaPagamentoSetFormaPagamento()),
    pesquisar: (formaPagamento) => dispatch(Actions.formaPagamentoPesquisar(formaPagamento)),
    setStateView: (stateView) => dispatch(Actions.formaPagamentoSetStateView(stateView)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)