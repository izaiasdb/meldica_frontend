import React, { Component } from 'react'
import { Row, Col, Form, Select, Input, DatePicker, Switch, Icon, Button } from 'antd'
import { isEqual, get, isNil } from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { PERFIL_ADMINISTRADOR } from '../../../util/constUtils'
import { EDITING } from '../../../util/state'
import { generateOptions } from '../../../util/helper'
import UsuarioActions from '../redux'
import { getUser } from '../../../../services/authenticationService'

class TabDados extends Component {

    constructor(props){
        super(props)
    }    

    confirmarSenha = (rule, value, callback) => {
        const { form } = this.props;

        if (value && value !== form.getFieldValue('usuario.senha')) {
            callback('Confirmação de senha inválida!');
        } else {
            callback();
        }
    };     

    render(){
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        const toInputLowercase = e => { e.target.value = ("" + e.target.value).toLowerCase(); };

        const { 
            keyHandler,
            state,
            form: { getFieldDecorator },
            perfis = [],
            profile = {},
            form: { getFieldValue },
            usuario = {}
        } = this.props
        const { nome, ativo, login, senha, email, dataInclusao, perfil = {}, unidade = {} } = usuario || {}
        const { id : idPerfil } = isNil(perfil) ? {} : perfil
        const { id : idUnidade } = isNil(unidade) ? {} : unidade
        const { perfil : { id : idPerfilLocal } } = getUser()
        const { unidadeAtual = {} } = profile

        const v_idPerfil = isNil(idPerfil) ? idPerfilLocal : idPerfil

        return(
            <div>
                <Row gutter={24}>
                    <Col span={ 8 }>                        
                        <Form.Item label={"Perfil"}>
                            {
                                getFieldDecorator('usuario.perfil.id', {
                                    rules: [{required: true, message: 'Informe o perfil.'}],
                                    initialValue: v_idPerfil || null
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        disabled = {!isEqual(idPerfilLocal, PERFIL_ADMINISTRADOR)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}                                            >
                                        <Select.Option key={1} value={null}>{"Selecione"}</Select.Option>
                                        {generateOptions(perfis.map(({id, nome: descricao}) => ({id, descricao})))}
                                </Select>
                                )
                            }                               
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Button type={ "primary"} 
                                onClick={this.copiarPermissoes}
                                style={{marginRight: '10px', marginTop: '42px'}}>
                                Copiar permissões
                        </Button>                    
                    </Col>                  
                </Row>
                <Row gutter={24}>                     
                    <Col span={ 2 }>
                        <Form.Item label={"Ativo"}>
                        {
                            getFieldDecorator('usuario.ativo', {
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
                                getFieldDecorator('usuario.dataInclusao', {
                                    rules: [{required: false}],
                                    initialValue: isNil(dataInclusao) ? new moment() : new moment(dataInclusao)
                                })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                            }                                
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('usuario.nome', {
                                    rules: [{ required: true, message: 'Por favor, informe o nome.' }],
                                    initialValue: nome || null
                                })(
                                    <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                                )
                            }
                        </Form.Item>
                    </Col>                    
                    <Col span={ 4 }>
                        <Form.Item label={"Login"} >
                            {
                                getFieldDecorator('usuario.login', {
                                    rules: [{ required: true, message: 'Por favor, informe o login.' }],
                                    initialValue: login || null,
                                })(
                                    <Input maxLength={ 40 } onKeyUp={keyHandler} 
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Login"/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    { isEqual(state, EDITING) &&
                    <div>
                    <Col span={ 4 }>
                        <Form.Item label={"Senha"} >
                            {
                                getFieldDecorator('usuario.senha', {
                                    rules: [{ required: true, message: 'Por favor, informe a senha.' }],
                                    initialValue: senha || null,
                                })(
                                <Input maxLength={ 20 } 
                                    onKeyUp={keyHandler} 
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha"/>
                                )
                            }
                        </Form.Item>
                    </Col>    
                    <Col span={ 4 }>
                        <Form.Item label="Confirmar senha">
                                {getFieldDecorator('usuario.senhaConfirmar', {
                                    rules: [
                                        { required: true, message: 'Por favor, confirme a sua nova senha!' },                                        
                                        { validator: this.confirmarSenha },
                                    ],
                                    initialValue: senha || null,
                                })(
                                    <Input maxLength={ 20 } 
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Confirmar nova senha" />,
                                )}
                        </Form.Item>                       
                    </Col>
                    </div>
                    }                     
                </Row>
                <Row>
                    <Col span={ 8 }>
                        <Form.Item label={"Email"}>
                            {
                                getFieldDecorator('usuario.email', {
                                    rules: [{ required: true, message: 'Por favor, informe o email.' }],
                                    initialValue: email || null
                                })(
                                    <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputLowercase} />
                                )
                            }
                        </Form.Item>
                    </Col>                     
                </Row>
            </div>
        )
    }    
    
    copiarPermissoes = () => {
        const { 
            form: { getFieldValue },
        } = this.props

        const id = getFieldValue('usuario.perfil.id');   
        this.props.getPerfilPermissoes(id);         
    }    
}

const mapStateToProps = (state) => {
    return {
        ...state.usuario.data,
        usuario: state.usuario.usuario,
        state: state.usuario.state,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(UsuarioActions.usuarioSetState(state)),
    getPerfilPermissoes: (obj) => dispatch(UsuarioActions.usuarioGetPerfilPermissoes(obj)),
    setCheckedKeys: (state) => dispatch(UsuarioActions.usuarioSetCheckedKeys(state)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabDados)