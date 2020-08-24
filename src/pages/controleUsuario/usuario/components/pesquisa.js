import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, Divider} from 'antd'
import { connect } from 'react-redux'
import { isEmpty, get, isEqual } from 'lodash'
import { generateOptions, getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import UsuarioActions from '../redux'
import { INSERTING } from '../../../util/state'

const Option = Select.Option

class Pesquisa extends Component {
    
    constructor(props){
        super(props)
    }

    componentDidMount() {
        this.props.init()
    }    

    UNSAFE_componentWillReceiveProps(nextProps){
    	const message = get(nextProps, ['message'], "")
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
        }
    }

    getExtra = () => {
        return (
            <div>
                <Button type={ "primary"}
                        htmlType="submit"
                        //disabled = {!hasAnyAuthority("USUARIO_CONSULTAR")}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '10px' }}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                        onClick={this.limpar}>
                        Limpar
                </Button>                
                <Divider type="vertical" />
                <Button type={ "primary"} 
                        //disabled = {!hasAnyAuthority("USUARIO_INSERIR")}
                        onClick={this.prepareInsert}>
                        Cadastrar Usuário
                </Button>                
            </div>
        )
    }

    prepareInsert = () => {
        const { setState, setUsuario, setCheckedKeys } = this.props
        setCheckedKeys(null)
        setState(INSERTING)
        setUsuario(null)
    }    

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { usuario }) => {
            if (!err) {
                this.props.pesquisar(usuario)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, perfis = [] } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Usuário")} 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>                   
                    <Col span={ 8 }>
                        <Form.Item label={"Perfil"}>
                            {
                                getFieldDecorator('usuario.perfil.id', {       
                                    rules: [{required: false, message: 'Informe o perfil.'}],
                                    initialValue: null                             
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Todas"}</Option>
                                        {generateOptions(perfis.map(({id, nome}) => ({id, descricao: nome})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('usuario.nome', {
                                    initialValue: null
                                })(
                                    <Input maxLength={ 200 } onInput={toInputUppercase} />
                                )
                            }
                        </Form.Item>
                    </Col>  
                    <Col span={ 8 }>
                        <Form.Item label={"Login"}>
                            {
                                getFieldDecorator('usuario.login', {
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
        ...state.usuario.data,
        fetching: state.usuario.fetching,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(UsuarioActions.usuarioInit()),
    cleanMessage: ()  => dispatch(UsuarioActions.usuarioCleanMessage()),
    cleanTable: () => dispatch(UsuarioActions.usuarioCleanTable()),
    pesquisar: (usuario) => dispatch(UsuarioActions.usuarioPesquisar(usuario)),
    setState: (state) => dispatch(UsuarioActions.usuarioSetState(state)),
    setUsuario: (usuario) => dispatch(UsuarioActions.usuarioSetUsuario(usuario)),    
    setCheckedKeys: (checkedKeys) => dispatch(UsuarioActions.usuarioSetCheckedKeys(checkedKeys)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)