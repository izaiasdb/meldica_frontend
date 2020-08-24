import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button, Spin, Switch, Checkbox  } from 'antd'
import { connect } from 'react-redux'
import LoginActions from './redux'
import DashboardActions from '../dashboard/redux'
import { isAuthenticated } from '../../services/authenticationService';
import { Redirect, Link, withRouter } from 'react-router-dom'
import './login.css'
import logo from '../../assets/images/logo2.png'
import { get, isEmpty, isNil } from 'lodash'
import { openNotification } from '../util/notification'

class AlterarSenha extends Component {    
    logar = (e) => {
        const { form, alterarSenha } = this.props
        e.preventDefault();

        form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                alterarSenha(values).then(function(){
                    this.redirecionar()
                })
          }
        });
    };

    redirecionar = () => {
        this.props.history.push("/login/")
    }

    confirmarSenha = (rule, value, callback) => {
        const { form } = this.props;

        if (value && value !== form.getFieldValue('novaSenha')) {
            callback('Confirmação de senha inválida!');
        } else {
            callback();
        }
    };      
    
    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        
        if (isAuthenticated()) {
            return <Redirect to={from} />
        }

        const { fetching, form: { getFieldDecorator } } = this.props;
        return (
            <div className={"container"}>
            <div className={"container-body"}>
                <Spin spinning={fetching} className={"box"}>
                    <Card style={{"borderRadius": "12px"}}
                          cover={<div id={"div_logo"}><img id={"logo"} src={logo} /></div>}>
                        <Form id={"form_login"} onSubmit={this.logar} >
                            <Form.Item label="Login">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Por favor, informe o seu login.' }],
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Login"
                                />
                            )}
                            </Form.Item>                         
                            <Form.Item label="Senha atual">
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Por favor, informe a sua senha.' }],
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="Nova senha">
                                {getFieldDecorator('novaSenha', {
                                    rules: [{ required: true, message: 'Por favor, informe a sua nova senha!' }],
                                })(
                                    <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Nova senha"
                                    />,
                                )}
                            </Form.Item>                            
                            <Form.Item label="Confirmar senha">
                                {getFieldDecorator('senhaConfirmar', {
                                    rules: [
                                        { required: true, message: 'Por favor, confirme a sua nova senha!' },
                                        { validator: this.confirmarSenha },
                                    ],
                                })(
                                    <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item> 
                            <div style={{"textAlign": "center"}}>                                
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Alterar senha
                                </Button>
                            </div>                                
                            </Form.Item>
                        </Form>
                    </Card>
                </Spin>
             </div>
             <div className={"footer"}>
                 <div id={"linha"}></div>
                <p>
                    <b>Secretaria da Administração Penitenciária</b><br/>
                    Rua Tenente Benévolo, 1055 - Meireles, Fortaleza/CE - CEP: 60160-040 Fone: (85) 3101.2840<br/>
                    © - Governo do Estado do Ceará. Todos os Direitos Reservados                
                </p>
             </div>
             </div>
        );
      }

      componentWillReceiveProps(nextProps){
    	const message = get(nextProps, ['message'], "")
    	if (!isEmpty(message)) {
            openNotification(message)
            this.props.cleanMessage()
		   }
      }
}

const mapStateToProps = (state) => {

    return {
        ...state.login.data,
        fetching: state.login.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(LoginActions.loginCleanMessage()),
    alterarSenha: (credenciais) => dispatch(LoginActions.loginAlterarSenha(credenciais)),
})

const WrappedAlterarSenha = Form.create()(AlterarSenha);
//export default connect(mapStateToProps, mapDispatchToProps)(WrappedAlterarSenha)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAlterarSenha))