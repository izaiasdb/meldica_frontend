import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal } from 'antd'
import { isEqual, get, isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import FormaPagamentoActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { formaPagamento } = this.props
                
                if (formaPagamento.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setFormaPagamento(null)
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
            formaPagamento
        } = this.props
        const { 
            id,
            nome, 
            ativo,
            idUsuarioInclusao,
            dataInclusao
        } = formaPagamento || {}         
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Formas de Pagamento`) } >
                    { getFieldDecorator("formaPagamento.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("formaPagamento.idUsuarioInclusao", { initialValue: idUsuarioInclusao })(<Input type="hidden" />) }
                    <Row gutter={24}>                        
                        <Col span={ 8 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('formaPagamento.nome', {
                                        rules: [{ required: true, message: 'Por favor, informe o nome.' }],
                                        initialValue: nome || null
                                    })(
                                        <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('formaPagamento.ativo', {
                                    initialValue: isNil(ativo) ? true : ativo,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                                                  
                        <Col span={ 4 }>
                            <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                                {
                                    getFieldDecorator('formaPagamento.dataInclusao', {
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
                        <Button 
                            type={"primary"} 
                            //htmlType={"submit"} 
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
        this.props.form.validateFields((err, { formaPagamento }) => {
            if (!err) {

                this.props.setFormaPagamento(formaPagamento)
                this.props.salvar(formaPagamento)                
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.formaPagamento.data,
        formaPagamento: state.formaPagamento.formaPagamento,
        stateView: state.formaPagamento.stateView,
        fetching: state.formaPagamento.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(FormaPagamentoActions.formaPagamentoCleanMessage()),
    cleanTable: () => dispatch(FormaPagamentoActions.formaPagamentoCleanTable()),    
    setStateView: (stateView) => dispatch(FormaPagamentoActions.formaPagamentoSetStateView(stateView)),
    salvar: (obj) => dispatch(FormaPagamentoActions.formaPagamentoSalvar(obj)),
    setFormaPagamento: (obj) => dispatch(FormaPagamentoActions.formaPagamentoSetFormaPagamento(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)