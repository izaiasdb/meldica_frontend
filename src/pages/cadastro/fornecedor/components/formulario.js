import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabEndereco from './tabEndereco'
import TabTelefone from './tabTelefone'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'

class Formulario extends Component {
    
    constructor(props){
        super(props)
        this.state = { activeKey: "1" }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { fornecedor } = this.props
                
                if (fornecedor.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setFornecedor(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    render() {
        const { activeKey } = this.state
        const { fetching, fornecedor, form } = this.props
        const { getFieldDecorator } = form
        const { id, ativo, idUsuarioInclusao} = isNil(fornecedor) ? {} : fornecedor

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Fornecedores`) } >                    
                    { getFieldDecorator("fornecedor.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("fornecedor.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados {...this.props} />
                            </Tabs.TabPane>                           
                            <Tabs.TabPane key={2} tab={<span><Icon type="home" />Endereços</span>}>
                                <TabEndereco {...this.props} />
                            </Tabs.TabPane>
                            <Tabs.TabPane key={3} tab={<span><Icon type="phone" />Telefones</span>}>
                                <TabTelefone {...this.props} />
                            </Tabs.TabPane>                              
                        </Tabs>
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
                            onClick={this.handleSubmit}
                            >
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

    handleReset = () => {
        this.props.form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { fornecedor }) => {
            if (!err) {
                this.props.setFornecedor(fornecedor)
                this.props.salvar(fornecedor)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.fornecedor.data,
        fornecedor: state.fornecedor.fornecedor,
        stateView: state.fornecedor.stateView,
        fetching: state.fornecedor.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.fornecedorCleanMessage()),
    cleanTable: () => dispatch(Actions.fornecedorCleanTable()),
    setStateView: (stateView) => dispatch(Actions.fornecedorSetStateView(stateView)),
    setFornecedor: (fornecedor) => dispatch(Actions.fornecedorSetFornecedor(fornecedor)),    
    salvar: (obj) => dispatch(Actions.fornecedorSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)