import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabEndereco from './tabEndereco'
import TabTelefone from './tabTelefone'
import TabRazao from './tabRazao'
import TabTabelaPreco from './tabTabelaPreco'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import DrawerTabelaPreco from '../../../movimentacao/ordemServico/components/drawerTabelaPreco'

class Formulario extends Component {
    
    constructor(props){
        super(props)
        this.state = { activeKey: "1" }
    }

    componentDidMount() {
        const { cliente, obter } = this.props
        const { id } = isNil(cliente) ? {} : cliente        

        if(!isNil(id)){
            obter(id)
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { cliente } = this.props
                
                if (cliente.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setCliente(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    showDrawer = () => {
        this.props.setDrawerVisivel(true);
    };

    onCloseDrawer = () => {
        this.props.setDrawerVisivel(false);
    };    

    render() {
        const { activeKey } = this.state
        const { fetching, cliente, form, drawerVisivel, } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { id, ativo, idUsuarioInclusao} = isNil(cliente) ? {} : cliente
        
        let idTabelaPreco = getFieldValue("clienteTabelaPreco.tabelaPreco.id")

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Cliente`) } >                    
                    { getFieldDecorator("cliente.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("cliente.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
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
                            <Tabs.TabPane key={4} tab={<span><Icon type="usergroup-add" />Razões Sociais</span>}>
                                <TabRazao {...this.props} />
                            </Tabs.TabPane> 
                            <Tabs.TabPane key={5} tab={<span><Icon type="dollar" />Tabela Preço</span>}>
                                <TabTabelaPreco {...this.props } showDrawer={this.showDrawer} onCloseDrawer={this.onCloseDrawer} />
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
                            onClick={this.handleSubmit}>
                            { this.isSaving() ? 'Salvar' : 'Atualizar' }
                        </Button>
                    </Row>
                </Card>
            </Form>
            <DrawerTabelaPreco {...this.props} onCloseDrawer={this.onCloseDrawer} drawerVisivel={drawerVisivel} idTabelaPreco={idTabelaPreco} />
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
        this.props.form.validateFields((err, { cliente }) => {
            if (!err) {
                this.props.setCliente(cliente)
                this.props.salvar(cliente)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.cliente.data,
        cliente: state.cliente.cliente,
        stateView: state.cliente.stateView,
        fetching: state.cliente.fetching,
        drawerVisivel: state.cliente.drawerVisivel,     
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    obter: (id) => dispatch(Actions.clienteObter(id)),    
    cleanMessage: ()  => dispatch(Actions.clienteCleanMessage()),
    cleanTable: () => dispatch(Actions.clienteCleanTable()),
    setStateView: (stateView) => dispatch(Actions.clienteSetStateView(stateView)),
    setCliente: (cliente) => dispatch(Actions.clienteSetCliente(cliente)),    
    salvar: (obj) => dispatch(Actions.clienteSalvar(obj)),
    setDrawerVisivel: (drawerVisivel) => dispatch(Actions.clienteSetDrawerVisivel(drawerVisivel)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)