import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal, InputNumber  } from 'antd'
import { isEqual, get, isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import FormaCondicaoPagamentoActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { formaCondicaoPagamento } = this.props
                
                if (formaCondicaoPagamento.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setFormaCondicaoPagamento(null)
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
            formaCondicaoPagamento,
            formaPagamentoList = [],
            condicaoPagamentoList = []
        } = this.props
        const { 
            id,
            formaPagamento, 
            condicaoPagamento, 
            ativo,
            idUsuarioInclusao,
            dataInclusao,
            percDesconto,
            entraPago
        } = formaCondicaoPagamento || {}

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Condições de Pagamento`) } >
                    { getFieldDecorator("formaCondicaoPagamento.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("formaCondicaoPagamento.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Col span={ 12 }>
                            <Form.Item label={"Forma de pagamento"}>
                                {
                                    getFieldDecorator('formaCondicaoPagamento.formaPagamento.id', {
                                        rules: [{ required: true, message: 'Por favor, informe a forma de pagamento.' }],
                                        initialValue: isNil(formaPagamento) ? null : formaPagamento.id
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
                        <Col span={ 12 }>
                            <Form.Item label={"Condição de pagamento"}>
                                {
                                    getFieldDecorator('formaCondicaoPagamento.condicaoPagamento.id', {
                                        rules: [{ required: true, message: 'Por favor, informe a condição de pagamento.' }],
                                        initialValue: isNil(condicaoPagamento) ? null : condicaoPagamento.id
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
                    <Row gutter={24}>
                        <Col span={ 5 }>
                            <Form.Item label={"Percentual de desconto"}>
                                {
                                    getFieldDecorator('formaCondicaoPagamento.percDesconto', {
                                        rules: [{required: true, message: 'Por favor, informe o percentual de desconto.'}],
                                        initialValue: percDesconto || 0
                                    })(
                                        <InputNumber style={{ width: "150" }}                                                         
                                        min={0}
                                        precision={2}
                                        step={1}                            
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>  
                        <Col span={ 4 }>
                            <Form.Item label={"Entra pago"}>
                            {
                                getFieldDecorator('formaCondicaoPagamento.entraPago', {
                                    initialValue: entraPago || true,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                                                
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('formaCondicaoPagamento.ativo', {
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
                                    getFieldDecorator('formaCondicaoPagamento.dataInclusao', {
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
        this.props.form.validateFields((err, { formaCondicaoPagamento }) => {
            if (!err) {

                this.props.setFormaCondicaoPagamento(formaCondicaoPagamento)
                this.props.salvar(formaCondicaoPagamento)                
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.formaCondicaoPagamento.data,
        formaCondicaoPagamento: state.formaCondicaoPagamento.formaCondicaoPagamento,
        stateView: state.formaCondicaoPagamento.stateView,
        fetching: state.formaCondicaoPagamento.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(FormaCondicaoPagamentoActions.formaCondicaoPagamentoCleanMessage()),
    cleanTable: () => dispatch(FormaCondicaoPagamentoActions.formaCondicaoPagamentoCleanTable()),    
    setStateView: (stateView) => dispatch(FormaCondicaoPagamentoActions.formaCondicaoPagamentoSetStateView(stateView)),
    salvar: (obj) => dispatch(FormaCondicaoPagamentoActions.formaCondicaoPagamentoSalvar(obj)),
    setFormaCondicaoPagamento: (obj) => dispatch(FormaCondicaoPagamentoActions.formaCondicaoPagamentoSetFormaCondicaoPagamento(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)