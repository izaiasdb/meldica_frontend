import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Input, Icon, Tabs, Modal } from 'antd'
import { isEqual, get, isNil, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import UsuarioActions from '../redux'
import TabDados from './tabDados'
import TabMenu from './tabMenu'

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
                const { usuario } = this.props
                
                // if (usuario.id){
                //     this.props.cleanTable()
                //     this.props.setState(SEARCHING)
                // } else {
                //     this.handleReset()
                //     this.props.setUsuario(null)
                // }
                this.props.cleanTable()
                this.props.setState(SEARCHING)
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    componentDidMount() {
        const { setFetching } = this.props
        setFetching(false)
    }

    render() {
        const { activeKey } = this.state
        const { 
            fetching,
            form: { getFieldDecorator },
            usuario = {}
        } = this.props
        const { id, idUsuarioInclusao, dataUltimoAcesso, desenvolvedor, trocaSenha, codigoVerificacao } = usuario || {}

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Usuário`) } >
                    { getFieldDecorator("usuario.id", { initialValue: isNil(id) ? null : id })(<Input type="hidden" />) }
                    { getFieldDecorator("usuario.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao })(<Input type="hidden" />) }
                    { getFieldDecorator("usuario.desenvolvedor", { initialValue: isNil(desenvolvedor) ? null : desenvolvedor  })(<Input type="hidden" />) }
                    { getFieldDecorator("usuario.dataUltimoAcesso", { initialValue: isNil(dataUltimoAcesso) ? null : dataUltimoAcesso })(<Input type="hidden" />) }
                    { getFieldDecorator("usuario.trocaSenha", { initialValue: isNil(trocaSenha) ? null : trocaSenha })(<Input type="hidden" />) }
                    { getFieldDecorator("usuario.codigoVerificacao", { initialValue: isNil(codigoVerificacao) ? null : codigoVerificacao })(<Input type="hidden" />) }
                    
                   <Row>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados keyHandler={this.keyHandler} {...this.props} />
                            </Tabs.TabPane>                            
                            {/* <Tabs.TabPane key={2} tab={<span><Icon type="solution" />Menu acesso</span>}>
                                <TabMenu keyHandler={this.keyHandler} {...this.props} />
                            </Tabs.TabPane>                             */}
                        </Tabs>
                   </Row>
                   <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"} onClick={this.handleSubmit}>
                            { this.isSaving() ? 'Salvar' : 'Atualizar' }
                        </Button>
                    </Row>                   
                </Card>
            </Form>
        </Spin>
        )
    }

    isSaving = () => isEqual(this.props.state, INSERTING)

    voltar = () => {
        const { confirm } = Modal;
        const { setState } = this.props;

        confirm({
            title: 'Tem certeza que deseja sair?',
            content: 'Os dados informados serão perdidos.',
            onOk() {
                setState(SEARCHING);
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
        this.props.form.validateFields((err, { usuario }) => {
            if (!err) {
                const { checkedKeys = [], unidadeIds = [] } = this.props

                // if (isNil(checkedKeys) || checkedKeys.length == 0) {
                //     openNotification({tipo: 'warning', descricao: 'Por favor, informe pelo menos uma permissão de acesso.'})
                //     return
                // }                                                         

                this.props.setUsuario(usuario)
                this.props.salvar(usuario)                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };     
}

const mapStateToProps = (state) => {

    return {
        ...state.usuario.data ,
        usuario: state.usuario.usuario,
        state: state.usuario.state,
        checkedKeys: state.usuario.checkedKeys,
        unidadeIds: state.usuario.unidadeIds,
        fetching: state.usuario.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(UsuarioActions.usuarioCleanMessage()),
    cleanTable: () => dispatch(UsuarioActions.usuarioCleanTable()),
    setState: (state) => dispatch(UsuarioActions.usuarioSetState(state)),
    salvar: (obj) => dispatch(UsuarioActions.usuarioSalvar(obj)),
    setFetching: (fetching) => dispatch(UsuarioActions.usuarioSetFetching(fetching)),
    setUsuario: (usuario) => dispatch(UsuarioActions.usuarioSetUsuario(usuario)),      
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)