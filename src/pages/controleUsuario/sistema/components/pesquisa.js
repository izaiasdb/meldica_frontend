import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, icon } from 'antd'
import { connect } from 'react-redux'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import SistemaActions from '../redux'

class Pesquisa extends Component {
    
    constructor(props){
        super(props)
    }

    getExtra = () => {
        return (
            <div>
                <Button type={ "primary"} 
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Button type={ "primary"}
                        htmlType="submit"
                        onClick={this.handleSubmit}
                        disabled = {!hasAnyAuthority("SISTEMA_CONSULTAR")}
                        icon="search"
                        style={{ marginLeft: '10px' }}>
                        Pesquisar
                </Button>
            </div>
        )
    }

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { sistema }) => {
            if (!err) {
                this.props.pesquisar(sistema)
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
            <Card title={getTitle("Pesquisa")} 
            // <Card
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"} style={{ marginTop:'-4px' }}>
                            {
                                getFieldDecorator('sistema.nome', {
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
        ...state.sistema.data,
        fetching: state.sistema.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(SistemaActions.sistemaCleanTable()),
    pesquisar: (sistema) => dispatch(SistemaActions.sistemaPesquisar(sistema)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)