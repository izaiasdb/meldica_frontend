import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
//import TabEndereco from './tabEndereco'
//import TabTelefone from './tabTelefone'
//import TabRazao from './tabRazao'
//import TabTabelaPreco from './tabTabelaPreco'
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
                const { empresa } = this.props
                
                if (empresa.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setEmpresa(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    render() {
        const { activeKey } = this.state
        const { fetching, empresa, form } = this.props
        const { getFieldDecorator } = form
        const { id, ativo, idUsuarioInclusao} = isNil(empresa) ? {} : empresa

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Empresa`) } >                    
                    { getFieldDecorator("empresa.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("empresa.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados {...this.props} />
                            </Tabs.TabPane>                           
                            {/* <Tabs.TabPane key={2} tab={<span><Icon type="home" />Endereços</span>}>
                                <TabEndereco {...this.props} />
                            </Tabs.TabPane>
                            <Tabs.TabPane key={3} tab={<span><Icon type="phone" />Telefones</span>}>
                                <TabTelefone {...this.props} />
                            </Tabs.TabPane>
                            <Tabs.TabPane key={4} tab={<span><Icon type="usergroup-add" />Razões Sociais</span>}>
                                <TabRazao {...this.props} />
                            </Tabs.TabPane> 
                            <Tabs.TabPane key={5} tab={<span><Icon type="dollar" />Tabela Preço</span>}>
                                <TabTabelaPreco {...this.props} />
                            </Tabs.TabPane>                                                            */}
                        </Tabs>
                    </Row>                    
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"}                             
                            htmlType={"submit"}>
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
        this.props.form.validateFields((err, { empresa }) => {
            if (!err) {
                this.props.setEmpresa(empresa)
                this.props.salvar(empresa)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.empresa.data,
        empresa: state.empresa.empresa,
        stateView: state.empresa.stateView,
        fetching: state.empresa.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.empresaCleanMessage()),
    cleanTable: () => dispatch(Actions.empresaCleanTable()),
    setStateView: (stateView) => dispatch(Actions.empresaSetStateView(stateView)),
    setEmpresa: (empresa) => dispatch(Actions.empresaSetEmpresa(empresa)),    
    salvar: (obj) => dispatch(Actions.empresaSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)