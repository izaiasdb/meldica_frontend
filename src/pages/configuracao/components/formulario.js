import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal, InputNumber  } from 'antd'
import { isEqual, get, isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'

import { SEARCHING, INSERTING, EDITING } from '../../util/state'
import { generateOptions, getTitle } from '../../util/helper'
import { openNotification } from '../../util/notification'
import ConfiguracaoActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { configuracao } = this.props
                
                if (configuracao.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setConfiguracao(null)
                }
            }

            this.props.cleanMessage()
        }
    }    

    render() {
        const { 
            fetching,
            keyHandler,
            state,
            form: { getFieldDecorator },
            configuracao,
            planoContaList = [],
        } = this.props
        const { 
            id,
            planoContaOrdemServico, 
            planoContaOrdemPagamento, 
            idUsuarioInclusao,
            dataInclusao,
        } = configuracao || {}

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Configuração`) } >
                    { getFieldDecorator("configuracao.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("configuracao.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Col span={ 12 }>
                            <Form.Item label={"Plano de conta de pedidos"}>
                                {
                                    getFieldDecorator('configuracao.planoContaOrdemServico.id', {
                                        rules: [{ required: true, message: 'Por favor, informe o Plano de conta de pedidos.' }],
                                        initialValue: isNil(planoContaOrdemServico) ? null : planoContaOrdemServico.id
                                    })(
                                        <Select showSearch
                                                placeholder={"Selecione"} 
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                allowClear>
                                            {generateOptions(planoContaList.map(({id, nome}) => ({id, descricao: nome})))}
                                    </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item label={"Plano de conta de compras"}>
                                {
                                    getFieldDecorator('configuracao.planoContaOrdemPagamento.id', {
                                        rules: [{ required: true, message: 'Por favor, informe o Plano de conta de compras.' }],
                                        initialValue: isNil(planoContaOrdemPagamento) ? null : planoContaOrdemPagamento.id
                                    })(
                                        <Select showSearch
                                                placeholder={"Selecione"} 
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                allowClear>
                                            {generateOptions(planoContaList.map(({id, nome}) => ({id, descricao: nome})))}
                                    </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>                        
                    </Row>
                    <Row gutter={24}>
                        <Col span={ 4 }>
                            <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                                {
                                    getFieldDecorator('configuracao.dataInclusao', {
                                        rules: [{required: false}],
                                        initialValue: dataInclusao ? new moment(dataInclusao) : new moment()
                                    })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                                }                                
                            </Form.Item>
                        </Col>                        
                    </Row>
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"} 
                                htmlType={"submit"} 
                                onClick={this.handleSubmit}>
                            { this.isSaving() ? 'Salvar' : 'Atualizar' }
                        </Button>
                    </Row>
                </Card>
            </Form>
        </Spin>
        )
    }

    isSaving = () => isEqual(this.props.stateView, INSERTING)

    voltar = () => {
        const { confirm } = Modal;
        const { setStateView } = this.props;

        confirm({
            title: 'Tem certeza que deseja sair?',
            content: 'Os dados informados serão perdidos.',
            onOk() {
                setStateView(SEARCHING);
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }

    keyHandler = ({key}) => { 
        switch (key) {
            case 'Enter':
                this.handleSubmit()
                break;
            case 'Escape':
                this.voltar();
                break;
            default: break;
        }
    }

    handleReset = () => {
        this.props.form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { configuracao }) => {
            if (!err) {

                this.props.setConfiguracao(configuracao)
                this.props.salvar(configuracao)                
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.configuracao.data,
        configuracao: state.configuracao.configuracao,
        stateView: state.configuracao.stateView,
        fetching: state.configuracao.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(ConfiguracaoActions.configuracaoCleanMessage()),
    cleanTable: () => dispatch(ConfiguracaoActions.configuracaoCleanTable()),    
    setStateView: (stateView) => dispatch(ConfiguracaoActions.configuracaoSetStateView(stateView)),
    salvar: (obj) => dispatch(ConfiguracaoActions.configuracaoSalvar(obj)),
    setConfiguracao: (obj) => dispatch(ConfiguracaoActions.configuracaoSetConfiguracao(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)