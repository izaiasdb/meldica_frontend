import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button, Spin, Switch, Checkbox, Row, Col  } from 'antd'
import { connect } from 'react-redux'
import LoginActions from './redux'
import { isAuthenticated } from '../../services/authenticationService';
import { Redirect } from 'react-router-dom'
import './login.css'
import logo from '../../assets/images/logo_welcome.png'
import { get, isEmpty, isNil } from 'lodash'
import { openNotification } from '../util/notification'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = { chkEsqueciSenha: false, chkInformarCodigoVerificacao: false, }
    }

    logar = (e) => {
        const { form, logar, esqueciSenha,alterarSenha  } = this.props
        const { chkEsqueciSenha, chkInformarCodigoVerificacao } = this.state
        e.preventDefault();

        form.validateFields((err, values) => {
            if (!err) {
                if (isNil(values.password) && chkEsqueciSenha) {
                    esqueciSenha(values).then(function(){
                        this.setState((prevState) => ({ 
                            chkInformarCodigoVerificacao: true,
                            chkEsqueciSenha : false
                        }))
                    })                    
                } else if (chkInformarCodigoVerificacao) {
                    alterarSenha(values)
                    this.setState((prevState) => ({ 
                        chkInformarCodigoVerificacao: false,
                        chkEsqueciSenha : false
                    }))                    
                } else {
                    logar(values)                    
                }                
          }
        });
    };

    confirmarSenha = (rule, value, callback) => {
        const { form } = this.props;

        if (value && value !== form.getFieldValue('novaSenha')) {
            callback('Confirmação de senha inválida!');
        } else {
            callback();
        }
    };      

    chkEsqueciSenhaChange = () => {
        this.setState((prevState) => ({ 
            chkEsqueciSenha: !prevState.chkEsqueciSenha,
            chkInformarCodigoVerificacao : false
        }))
    }

    chkInformarCodigoVerificacaoChange = () => {
        this.setState((prevState) => ({ 
            chkInformarCodigoVerificacao: !prevState.chkInformarCodigoVerificacao,
            chkEsqueciSenha : false
        }))
    }    

    btnEsqueciSenhaClick = () => {
        this.setState((prevState) => ({ 
            chkEsqueciSenha: !prevState.chkEsqueciSenha,
            chkInformarCodigoVerificacao : false
        }))
    }

    btnInformarCodigoVerificacaoClick = () => {
        this.setState((prevState) => ({ 
            chkInformarCodigoVerificacao: !prevState.chkInformarCodigoVerificacao,
            chkEsqueciSenha : false
        }))
    }

    btnVoltar = () => {
        this.setState({ 
            chkEsqueciSenha: false,
            chkInformarCodigoVerificacao : false
        })
    }    
    
    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { chkEsqueciSenha, chkInformarCodigoVerificacao } = this.state
        const labelBotao = chkEsqueciSenha ? "Enviar solicitação de senha" : 
        (chkInformarCodigoVerificacao ? "Salvar nova senha" : "Entrar")
        
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
                        <Row gutter={12}>
                            <Col span={ 24 }>
                                <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Por favor, informe o seu login.' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Login"
                                    />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        { !chkEsqueciSenha && !chkInformarCodigoVerificacao &&
                        <Row gutter={12}>
                            <Col span={ 24 }>                            
                                <Form.Item>
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
                            </Col>
                        </Row>                                
                        }
                        { chkInformarCodigoVerificacao && !chkEsqueciSenha &&
                        <div>
                        <Row gutter={12}>
                            <Col span={ 24 }>
                                <Form.Item label="Código verificação">
                                    {getFieldDecorator('codigoVerificacao', {
                                        rules: [{ required: true, message: 'Por favor, informe a sua senha.' }],
                                    })(
                                        <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Código verificação"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>       
                        <Row gutter={12}>
                            <Col span={ 24 }>
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
                                </Col>
                        </Row>                                
                        <Row gutter={12}>
                            <Col span={ 24 }>                                
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
                            </Col>
                        </Row>                                
                        </div>}
                        { !chkEsqueciSenha && !chkInformarCodigoVerificacao &&
                        <Row gutter={12} style={{"textAlign": "right"}}>
                            <Col span={ 24 }>
                                <Button type="link"
                                        style={{ fontWeight: "bold" }}
                                        onClick = { (e) => this.btnEsqueciSenhaClick() }>
                                    Esqueci a senha        
                                </Button>
                            </Col>
                        </Row>}
                        { !chkInformarCodigoVerificacao && chkEsqueciSenha &&
                        <Row gutter={12} style={{"textAlign": "right"}}>
                            <Col span={ 24 }>
                                <Button type="link"
                                        style={{ fontWeight: "bold" }}
                                        onClick = { (e) => this.btnInformarCodigoVerificacaoClick() }>
                                    Já tenho o código de verificação
                                </Button>
                            </Col>
                        </Row>}                        
                        { chkEsqueciSenha && 
                        <Row gutter={12}>
                                <p style={{ color: "red", backgroundColor: "#FBE9E9", padding: "10px" }}>
                                    <b>Atenção!!!</b> Será enviado um código de verificação para <br/>
                                    o e-mail informado no cadastro. Após o recebimento do <br/>
                                    código de verificação, informe o mesmo para alterar a senha.
                                </p>
                        </Row>}
                        {/* { chkInformarCodigoVerificacao && !chkEsqueciSenha &&
                        <Row gutter={12}>
                                <p style={{ color: "red" }}>
                                    <b>Atenção:</b>Será enviado um código de verificação para <br/>
                                    o e-mail informado no cadastro. Após o recebimento do <br/>
                                    código de verificação, informe o mesmo para alterar a senha.
                                </p>
                        </Row>} */}
                        <Row gutter={12} style={{ marginTop: "15px" }}>
                            <Col span={ (chkEsqueciSenha || chkInformarCodigoVerificacao) ? 12 : 24 }>
                            <div style={{"textAlign": "center"}}>                                
                                <Button type="primary" 
                                        htmlType="submit" 
                                        className="login-form-button">
                                    {labelBotao}
                                </Button>
                            </div>
                            </Col>
                            { (chkEsqueciSenha || chkInformarCodigoVerificacao) &&
                            <Col span={ 12 }>                                                          
                                <Button type="primary" 
                                        block 
                                        className="login-form-button"
                                        onClick = { (e) => this.btnVoltar() }>
                                    Voltar
                                </Button>
                            </Col>}                            
                        </Row>
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
    logar: (credenciais) => dispatch(LoginActions.loginLogar(credenciais)),
    esqueciSenha: (credenciais) => dispatch(LoginActions.loginEsqueciSenha(credenciais)),
    alterarSenha: (credenciais) => dispatch(LoginActions.loginAlterarSenha(credenciais)),
})

const WrappedLogin = Form.create()(Login);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedLogin)