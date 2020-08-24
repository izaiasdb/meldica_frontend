import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import { getTitle } from '../../../util/helper'
import PerfilActions from '../redux'
import { INSERTING } from '../../../util/state'

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
                        disabled = {!hasAnyAuthority("PERFIL_CONSULTAR")}
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
                        disabled = {!hasAnyAuthority("PERFIL_INSERIR")}
                        onClick={this.prepareInsert}>
                        Cadastrar Perfil
                </Button>                
            </div>
        )
    }

    prepareInsert = () => {
        const { setState, setPerfil } = this.props
        setState(INSERTING)
        setPerfil(null)
    }

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { perfil }) => {
            if (!err) {
                this.props.pesquisar(perfil)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Perfil")} 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"} style={{ marginTop:'-4px' }}>
                            {
                                getFieldDecorator('perfil.nome', {
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
        ...state.perfil.data,
        fetching: state.perfil.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(PerfilActions.perfilInit()),
    cleanTable: () => dispatch(PerfilActions.perfilCleanTable()),
    pesquisar: (perfil) => dispatch(PerfilActions.perfilPesquisar(perfil)),
    setState: (state) => dispatch(PerfilActions.perfilSetState(state)),
    setPerfil: (perfil) => dispatch(PerfilActions.perfilSetPerfil(perfil)),
    cleanMessage: ()  => dispatch(PerfilActions.perfilCleanMessage()),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)