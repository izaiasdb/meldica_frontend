import React, { Component } from 'react'
import { Card, Row, Col, Input, Button, Select, Form, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { generateOptions, getTitle } from '../../../util/helper'
import { getUnidadesAcesso, hasAnyAuthority } from '../../../../services/authenticationService'
import { openNotification } from '../../../util/notification'
import Actions from '../redux'
import { INSERTING } from '../../../util/state'

const Option = Select.Option

class Pesquisa extends Component {

    constructor(props) {
        super(props)
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
                <Button type={"primary"}
                        htmlType={"submit"}
                        onClick={this.handleSubmit}
                        disabled = {!hasAnyAuthority("PRODUTOS_CONSULTAR")}>
                        Pesquisar
                </Button>
                <Divider type="vertical" />
                <Button type={"primary"}
                        onClick={this.limpar}>
                        Limpar
                </Button>
                <Divider type="vertical" />
                <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("PRODUTOS_INSERIR")}
                            onClick={this.prepareInsert}>
                            Cadastrar
                </Button>
            </div>
        )
    }

    prepareInsert = () => {
        const { setStateView, setProduto } = this.props
        setStateView(INSERTING)
        setProduto(null)        
    }    

    limpar = () => {
        this.setState({ produto: {} })
        const { cleanTable, form: { resetFields } } = this.props
        resetFields()
        cleanTable()
    }

    handleSubmit = e => {
        this.props.cleanTable()
        e.preventDefault();
        this.props.form.validateFields((err, { produto }) => {
            if (!err) {
                this.props.pesquisar(produto)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    render() {
        const { form } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Form onSubmit={this.handleSubmit}>
            <Card title={getTitle("Pesquisa Produto")}
                extra={this.getExtra()}
                style={{ marginBottom: '10px' }}
                >
                <Row gutter={12}>
                    <Col span={10}>
                        <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('produto.nome', {
                                    initialValue: null
                                })(
                                    <Input placeholder={"Digite o nome do produto"} 
                                        maxLength={200} onInput={toInputUppercase} />
                                )
                            }
                        </Form.Item>
                    </Col>    
                    <Col span={4}>
                        <Form.Item label={"Tipo Produto"}>
                            {
                                getFieldDecorator('produto.tipo', {
                                    initialValue: null
                                })(
                                    <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'P'}>{"PRODUTO"}</Option>
                                        <Option key={3} value={'I'}>{"INSUMO"}</Option>
                                        <Option key={3} value={'C'}>{"COMBINADO"}</Option>
                                    </Select>
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
        ...state.produto.data,
        fetching: state.produto.fetching,
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(Actions.produtoCleanTable()),
    cleanMessage: ()  => dispatch(Actions.produtoCleanMessage()),
    pesquisar: (produto) => dispatch(Actions.produtoPesquisar(produto)),
    setProduto: (produto) => dispatch(Actions.produtoSetProduto(produto)),
    setStateView: (stateView) => dispatch(Actions.produtoSetStateView(stateView)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)