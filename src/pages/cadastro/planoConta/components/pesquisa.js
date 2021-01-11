import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, Divider } from 'antd'
import { connect } from 'react-redux'
import { isEmpty, get, isEqual } from 'lodash'
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

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")
         
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
        }
    }

    componentDidMount() {
        this.props.init()
    }    

    getExtra = () => {
        return (
            <div>
                <Button type={ "primary"} 
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"}
                        htmlType="submit"
                        disabled = {!hasAnyAuthority("PLANO_DE_CONTAS_CONSULTAR")}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '10px' }}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("PLANO_DE_CONTAS_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>                
            </div>
        )
    }

    prepareInsert = () => {
        const { setStateView, setPlanoConta } = this.props
        setStateView(INSERTING)
        setPlanoConta(null)        
    }    

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { planoConta }) => {
            if (!err) {
                this.props.pesquisar(planoConta)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, modulos = [] } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa") } 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>                   
                    {/* <Col span={ 8 }>
                        <Form.Item label={"Módulo"}>
                            {
                                getFieldDecorator('planoConta.modulo.id', {      
                                    initialValue: null                              
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Todas"}</Option>
                                        {generateOptions(modulos.map(({id, nome}) => ({id, descricao: nome})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col> */}
                    <Col span={4}>
                        <Form.Item label={"Tipo"}>
                            {
                                getFieldDecorator('planoConta.receitaDespesa', {
                                    initialValue: null
                                })(
                                    <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'R'}>{"RECEITA"}</Option>
                                        <Option key={2} value={'D'}>{"DDESPESA"}</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>                     
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('planoConta.nome', {
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
        ...state.planoConta.data,
        fetching: state.planoConta.fetching,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(Actions.planoContaInit()),
    cleanMessage: ()  => dispatch(Actions.planoContaCleanMessage()),
    cleanTable: () => dispatch(Actions.planoContaCleanTable()),
    pesquisar: (planoConta) => dispatch(Actions.planoContaPesquisar(planoConta)),
    setPlanoConta: (planoConta) => dispatch(Actions.planoContaSetPlanoConta(planoConta)),
    setStateView: (stateView) => dispatch(Actions.planoContaSetStateView(stateView)),        
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)