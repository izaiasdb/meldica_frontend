import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form } from 'antd'
import { connect } from 'react-redux'
import { generateOptions, getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import ModuloActions from '../redux'

const Option = Select.Option

class Pesquisa extends Component {
    
    constructor(props){
        super(props)
    }

    componentDidMount() {
        this.props.init()
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
                        disabled = {!hasAnyAuthority("MODULO_CONSULTAR")}
                        onClick={this.handleSubmit}
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
        this.props.form.validateFields((err, { modulo }) => {
            if (!err) {
                this.props.pesquisar(modulo)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form, sistemas = [] } = this.props
        const { getFieldDecorator } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
        <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa")} 
                  extra={this.getExtra()}
                  style={{ marginBottom: '10px'}}>
                <Row gutter={ 12 }>                   
                    <Col span={ 8 }>
                        <Form.Item label={"Sistemas"}>
                            {
                                getFieldDecorator('modulo.sistema.id', {        
                                    initialValue: null                           
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        <Option key={1} value={null}>{"Todas"}</Option>
                                        {generateOptions(sistemas.map(({id, abreviado}) => ({id, descricao: abreviado})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 8 }>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('modulo.nome', {
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
        ...state.modulo.data,
        fetching: state.modulo.fetching,
        profile: state.login.data.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    init: ()  => dispatch(ModuloActions.moduloInit()),
    cleanTable: () => dispatch(ModuloActions.moduloCleanTable()),
    pesquisar: (modulo) => dispatch(ModuloActions.moduloPesquisar(modulo)),
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)