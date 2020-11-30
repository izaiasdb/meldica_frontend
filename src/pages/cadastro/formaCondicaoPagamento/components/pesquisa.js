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
        this.props.init()
    }    

    getExtra = () => {
        return (
            <div>
                <Button type={ "primary"}
                        htmlType="submit"
                        disabled = {!hasAnyAuthority("FORMA_CONDICOES_DE_PAGAMENTO_CONSULTAR")}
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
                            disabled = {!hasAnyAuthority("FORMA_CONDICOES_DE_PAGAMENTO_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>                  
            </div>
        )
    }

    prepareInsert = () => {
        this.props.setStateView(INSERTING)
        this.props.setFormaCondicaoPagamento(null)
    }    

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { formaCondicaoPagamento }) => {
            if (!err) {
                this.props.pesquisar(formaCondicaoPagamento)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, condicaoPagamentoList = [], formaPagamentoList = [] } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa")} 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>
                    <Col span={ 8 }>
                        <Form.Item label={"Forma de pagamento"}>
                            {
                                getFieldDecorator('formaCondicaoPagamento.formaPagamento.id', {
                                    initialValue: null
                                })(
                                <Select showSearch
                                        placeholder={"Selecione"} 
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        allowClear>
                                        {generateOptions(formaPagamentoList.map(({id, nome}) => ({id, descricao: nome})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>  
                    <Col span={ 8 }>
                        <Form.Item label={"Condição de pagamento"}>
                            {
                                getFieldDecorator('formaCondicaoPagamento.condicaoPagamento.id', {
                                    initialValue: null
                                })(
                                    <Select showSearch
                                            placeholder={"Selecione"} 
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            allowClear>
                                        {generateOptions(condicaoPagamentoList.map(({id, nome}) => ({id, descricao: nome})))}
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
        ...state.formaCondicaoPagamento.data,
        fetching: state.formaCondicaoPagamento.fetching,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.formaCondicaoPagamentoInit()),
    cleanTable: () => dispatch(Actions.formaCondicaoPagamentoCleanTable()),
    setFormaCondicaoPagamento: () => dispatch(Actions.formaCondicaoPagamentoSetformaCondicaoPagamento()),
    pesquisar: (formaCondicaoPagamento) => dispatch(Actions.formaCondicaoPagamentoPesquisar(formaCondicaoPagamento)),
    setStateView: (stateView) => dispatch(Actions.formaCondicaoPagamentoSetStateView(stateView)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)