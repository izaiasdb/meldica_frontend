import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Input, Icon, Tabs, Modal } from 'antd'
import { isEqual, get, isNil, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import PerfilActions from '../redux'
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
                const { perfil } = this.props
                
                if (perfil.id){
                    this.props.cleanTable()
                    this.props.setState(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setPerfil(null)
                }
            }

            this.props.cleanMessage()
        }
    }    

    setActiveKey = (activeKey) => this.setState({activeKey})

    render() {
        const { activeKey } = this.state
        const { 
            fetching,
            form: { getFieldDecorator }, 
            perfil = {}
        } = this.props
        const { id, idUsuarioInclusao } = perfil || {}
        //const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'} de perfil`) } >
                    { getFieldDecorator("perfil.id", { initialValue: isNil(id) ? null : id })(<Input type="hidden" />) }
                    { getFieldDecorator("perfil.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao })(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados keyHandler={this.keyHandler} {...this.props} />
                            </Tabs.TabPane>
                            <Tabs.TabPane key={2} tab={<span><Icon type="solution" />Menu acesso</span>}>
                                <TabMenu keyHandler={this.keyHandler} {...this.props} />
                            </Tabs.TabPane>                            
                        </Tabs>
                    </Row>
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"} 
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
        this.props.form.validateFields((err, { perfil }) => {
            if (!err) {

                this.props.setPerfil(perfil)
                this.props.salvar(perfil)

                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {

    return {
        ...state.perfil.data,
        perfil: state.perfil.perfil,
        state: state.perfil.state,
        fetching: state.perfil.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(PerfilActions.perfilCleanTable()),
    setState: (state) => dispatch(PerfilActions.perfilSetState(state)),
    salvar: (obj) => dispatch(PerfilActions.perfilSalvar(obj)),
    setPerfil: (perfil) => dispatch(PerfilActions.perfilSetPerfil(perfil)),  
    cleanMessage: ()  => dispatch(PerfilActions.perfilCleanMessage()),  
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)