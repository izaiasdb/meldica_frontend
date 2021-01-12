import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, InputNumber, Modal, Tag } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import Actions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillMount() {
        this.props.init()
    }   


    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { planoConta } = this.props
                
                this.props.cleanTable()
                this.props.setStateView(SEARCHING)
                // if (planoConta.id){
                //     this.props.cleanTable()
                //     this.props.setStateView(SEARCHING)
                // } else {
                //     this.handleReset()
                //     this.props.setPlanoConta(null)
                // }
            }

            this.props.cleanMessage()
        }
    }

    render() {
        const { 
            fetching,
            keyHandler,
            form: { getFieldDecorator, getFieldValue },
            planoContaList = [],
            planoConta = {}
        } = this.props
        const { id, 
            idUsuarioInclusao, 
            nome, 
            ativo,
            dataInclusao, 
            nivel, 
            planoContaPai,
            numeroConta, 
            receitaDespesa
        } = planoConta || {}
        const { id: idPlanoContaPai } = planoContaPai || {}
       
        let planoContaNivel = getFieldValue("planoConta.nivel") || nivel
        let idPlanoContaPaiForm = getFieldValue("planoConta.planoContaPai.id") || idPlanoContaPai 
        //let numeroContaPaiForm = planoContaList.find(c=> c.id == idPlanoContaPaiForm)

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'} de Plano de Conta`) } >
                    { getFieldDecorator("planoConta.id", { initialValue: isNil(id) ? null : id })(<Input type="hidden" />) }
                    { getFieldDecorator("planoConta.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao })(<Input type="hidden" />) }
                    { getFieldDecorator("planoConta.numeroConta", { initialValue: numeroConta })(<Input type="hidden" />) }
                    <Row gutter={12}>                      
                        <Col span={ 18 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('planoConta.nome', {
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
                                getFieldDecorator('planoConta.ativo', {
                                    initialValue: isNil(ativo) ? true : ativo,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO" />
                                )
                            }
                            </Form.Item>
                        </Col>                        
                    </Row>
                    <Row gutter={12}>                      
                        <Col span={ 2 }>
                            <Form.Item label={"Nível"}>
                            {
                                getFieldDecorator('planoConta.nivel', {
                                    rules: [{ required: true, message: "Por favor, informe o nível."}],
                                    initialValue: nivel || null,
                                })(
                                    <InputNumber style={{ width: '100%'}} 
                                                max={300} 
                                                min={0} 
                                                maxLength={3}
                                                formatter={value => new String(value).replace(/([a-zA-Z]*)/g,'') } />
                                )
                            }                                
                            </Form.Item>                            
                        </Col>                              
                        <Col span={ 8 }>
                            <Form.Item label={"Plano de Conta (Nível acima)"}>
                            {
                                getFieldDecorator('planoConta.planoContaPai.id', {
                                    rules: [{required: planoContaNivel > 1, message: 'Informe o Plano Conta.'}],
                                    initialValue: isNil(idPlanoContaPai) ? null : idPlanoContaPai,
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Select.Option key={2} value={null}>{"Selecione"}</Select.Option>
                                        {generateOptions(planoContaNivel && planoContaNivel > 1 && planoContaList.filter(c => c.nivel == planoContaNivel - 1).map(({id, nome: descricao}) => ({id, descricao})))}
                                </Select>
                                )
                            }                                
                            </Form.Item>                            
                        </Col>
                        {/* { numeroContaPaiForm &&
                        <Col span={ 6 }>
                            <Form.Item label={"Número Conta (Nível acima)"}>
                                {
                                    <Tag color={'green'}
                                        style={{ fontSize: '20px', padding: '5px'}}>
                                        { numeroContaPaiForm.numeroConta }
                                    </Tag>
                                }
                            </Form.Item>
                        </Col>    
                        }                     */}
                        {/* { isEqual(this.props.stateView, EDITING) &&
                        <Col span={ 4 }>
                            <Form.Item label={"Número Conta"}>
                                {
                                    getFieldDecorator('planoConta.numeroConta', {
                                        rules: [{ required: false, message: 'Por favor, informe o nome.' }],
                                        initialValue: numeroConta || null
                                    })(
                                        <Input disabled maxLength={ 20 } onKeyUp={keyHandler} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        }                     */}
                        <Col span={ 4 }>
                            <Form.Item label={"Tipo de Plano de Conta"}>
                                {
                                    getFieldDecorator('planoConta.receitaDespesa', {
                                        rules: [{required: true, message: 'Por favor, informe o tipo.'}],
                                        initialValue: receitaDespesa || 'D'
                                    })(
                                    <Select showSearch
                                            optionFilterProp="children"
                                            //value = {numeroContaPaiForm && numeroContaPaiForm.receitaDespesa}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                            <Option key={1} value={null}>{"Selecione"}</Option>
                                            <Option key={2} value={'R'}>{"RECEITA"}</Option>
                                            <Option key={3} value={'D'}>{"DESPESA"}</Option>
                                    </Select>
                                    )
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
        this.props.form.validateFields((err, { planoConta }) => {
            if (!err) {
                this.props.setPlanoConta(planoConta)
                this.props.salvar(planoConta)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.planoConta.data,
        planoConta: state.planoConta.planoConta,
        stateView: state.planoConta.stateView,
        fetching: state.planoConta.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.planoContaInit()),
    cleanMessage: ()  => dispatch(Actions.planoContaCleanMessage()),
    cleanTable: () => dispatch(Actions.planoContaCleanTable()),
    setStateView: (stateView) => dispatch(Actions.planoContaSetStateView(stateView)),
    salvar: (obj) => dispatch(Actions.planoContaSalvar(obj)),
    pesquisarPlanoConta: (obj) => dispatch(Actions.pesquisarPlanoConta(obj)),  
    setPlanoConta: (planoConta) => dispatch(Actions.planoContaSetPlanoConta(planoConta)),     
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)