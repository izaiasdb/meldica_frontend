import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal, InputNumber  } from 'antd'
import { isEqual, get, isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import CondicaoPagamentoActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { condicaoPagamento } = this.props
                
                if (condicaoPagamento.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setCondicaoPagamento(null)
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
            condicaoPagamento,
        } = this.props
        const { 
            id,
            nome, 
            ativo,
            idUsuarioInclusao,
            dataInclusao,
            qtdParcela,
            diasParcela,
            prazoDias,
            entrada
        } = condicaoPagamento || {}

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Condições de Pagamento`) } >
                    { getFieldDecorator("condicaoPagamento.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("condicaoPagamento.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Col span={ 18 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('condicaoPagamento.nome', {
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
                                getFieldDecorator('condicaoPagamento.ativo', {
                                    initialValue: ativo || true,
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
                                    getFieldDecorator('condicaoPagamento.dataInclusao', {
                                        rules: [{required: false}],
                                        initialValue: dataInclusao ? new moment(dataInclusao) : new moment()
                                    })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                                }                                
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={ 4 }>
                            <Form.Item label={"Qtd. Parcela"}>
                                {
                                    getFieldDecorator('condicaoPagamento.qtdParcela', {
                                        rules: [{required: true, message: 'Por favor, informe as quantidades de parcelas.'}],
                                        initialValue: qtdParcela || 0
                                    })(
                                        <InputNumber style={{ width: "150" }}                                                         
                                        min={0}
                                        precision={0}
                                        step={1}                            
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 4 }>
                            <Form.Item label={"Dias P/ 1º parcela"}>
                                {
                                    getFieldDecorator('condicaoPagamento.diasParcela', {
                                        rules: [{required: true, message: 'Por favor, informe as quantidades de parcelas.'}],
                                        initialValue: diasParcela || 0
                                    })(
                                        <InputNumber style={{ width: "150" }}                                                         
                                        min={0}
                                        precision={0}
                                        step={1}                            
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 4 }>
                            <Form.Item label={"Prazo Dias Ex: 30x30"}>
                                {
                                    getFieldDecorator('condicaoPagamento.prazoDias', {
                                        rules: [{required: true, message: 'Por favor, informe as quantidades de parcelas.'}],
                                        initialValue: prazoDias || 0
                                    })(
                                        <InputNumber style={{ width: "150" }}                                                         
                                        min={0}
                                        precision={0}
                                        step={1}                            
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>  
                        {/* <Col span={ 2 }>
                            <Form.Item label={"Entrada"}>
                            {
                                getFieldDecorator('condicaoPagamento.entrada', {
                                    initialValue: entrada || true,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                                                   */}
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
        this.props.form.validateFields((err, { condicaoPagamento }) => {
            if (!err) {

                this.props.setCondicaoPagamento(condicaoPagamento)
                this.props.salvar(condicaoPagamento)                
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.condicaoPagamento.data,
        condicaoPagamento: state.condicaoPagamento.condicaoPagamento,
        stateView: state.condicaoPagamento.stateView,
        fetching: state.condicaoPagamento.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(CondicaoPagamentoActions.condicaoPagamentoCleanMessage()),
    cleanTable: () => dispatch(CondicaoPagamentoActions.condicaoPagamentoCleanTable()),    
    setStateView: (stateView) => dispatch(CondicaoPagamentoActions.condicaoPagamentoSetStateView(stateView)),
    salvar: (obj) => dispatch(CondicaoPagamentoActions.condicaoPagamentoSalvar(obj)),
    setCondicaoPagamento: (obj) => dispatch(CondicaoPagamentoActions.condicaoPagamentoSetCondicaoPagamento(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)