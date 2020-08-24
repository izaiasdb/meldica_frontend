import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Modal, Row, Col } from 'antd';
import AlterarSenhaActions from './redux'
import { getUser } from '../../services/authenticationService';

class AlterarSenha extends Component {
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

    render() {
        const { 
            form: { getFieldDecorator },
        } = this.props

        return (
            <Modal
            title="Alterar senha"
            visible={this.props.visivel}            
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            width = {800}          
            >                                
                <Form onSubmit={this.handleSubmit} >
                    <Row gutter={ 12}>
                        <Col span={12}>
                            <Form.Item label="Senha atual">
                                {getFieldDecorator('usuario.senhaAtual', {
                                    rules: [{ required: true, message: 'Por favor, informe a sua senha atual!' }],
                                })(
                                    <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha atual"
                                    />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={ 12}>
                        <Col span={12}>
                            <Form.Item label="Nova senha">
                                {getFieldDecorator('usuario.senha', {
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
                        <Col span={12}>
                            <Form.Item label="Confirmar senha">
                                {getFieldDecorator('usuario.senhaConfirmar', {
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
                </Form>
            </Modal>
        );
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
                const { login } = getUser()
                usuario.login = login;                

                this.props.setVisivel(false);
                this.props.salvar(usuario)
                this.handleReset();
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    handleCancel = e => {
        this.props.setVisivel(false);        
    }; 
     
}
            
const mapStateToProps = (state) => {

    return {
        visivel: state.alterarSenha.visivel,
    }
}

const mapDispatchToProps = (dispatch) => ({
    salvar: (obj) => dispatch(AlterarSenhaActions.alterarSenhaSalvar(obj)),
    setVisivel: (visibilidade) => dispatch(AlterarSenhaActions.alterarSenhaSetVisivel(visibilidade)),
})

const wrapedAlterarSenha = Form.create()(AlterarSenha)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedAlterarSenha)
