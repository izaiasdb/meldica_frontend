import React, { Component } from 'react'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider, Switch } from 'antd'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import NumericInput from '../../../util/numericInput'
import { INSERTING, EDITING } from '../../../util/state'

export default class TabTelefone extends Component {

    constructor(props){
        super(props)

        this.state = {
            descricao: null,
            viewStateTab: INSERTING,
        };
    }

    adicionar = () => {
        const { form: { getFieldValue, setFieldsValue }, tabelaPrecoList = [] } = this.props

        let clienteTabelaPreco = getFieldValue("clienteTabelaPreco")
        let error = false
        Object.keys(clienteTabelaPreco).forEach(key => {
            if(key != "id" &&
                (isNil(clienteTabelaPreco[key]) || isEmpty(trim(clienteTabelaPreco[key])))) {
                openNotification({tipo: 'warning', descricao: `Por favor, preencha o(a) ${key.toUpperCase()}.`})
                error = true
            }
        })

        if(!(clienteTabelaPreco.tabelaPreco && clienteTabelaPreco.tabelaPreco.id)){
            openNotification({tipo: 'warning', descricao: 'Tabela precisa ser informada!'})
            error = true
        }    
        
        let clienteTabelaPrecoList = getFieldValue("cliente.clienteTabelaPrecoList")

        let existe = clienteTabelaPrecoList.find(c=> c.tabelaPreco.id == clienteTabelaPreco.tabelaPreco.id)

        if(existe){
            openNotification({tipo: 'warning', descricao: 'Tabela já cadastrada para esse cliente!'})
            error = true
        }  

        if(error) return null
                
        if (clienteTabelaPreco.id){
            let oldRegistro = clienteTabelaPrecoList.find(c=> c.id == clienteTabelaPreco.id)

            const index = clienteTabelaPrecoList.indexOf(oldRegistro);

            if (index > -1) {
              clienteTabelaPrecoList.splice(index, 1);
            }          
        }        

        let item = tabelaPrecoList.find(c=> c.id == clienteTabelaPreco.tabelaPreco.id)
        //clienteTabelaPreco.tabelaPreco.descricao = this.state.descricao
        clienteTabelaPreco.tabelaPreco.descricao = item.nome
        clienteTabelaPrecoList.push(clienteTabelaPreco)
        this.limpar()
        setFieldsValue({
            cliente: { clienteTabelaPrecoList },
            clienteTabelaPreco: {
                id: null,
                tabelaPreco: { id: null }
            }
        })
        this.setState({ viewStateTab: INSERTING })
    }

    prepareUpdate = (clienteTabelaPreco) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ clienteTabelaPreco: {...clienteTabelaPreco } } )
        this.setState({ viewStateTab: EDITING })
    }
    
    remover = (index) => {
        const { form: {getFieldValue, setFieldsValue } } = this.props
        let clienteTabelaPrecoList = getFieldValue("cliente.clienteTabelaPrecoList")
        clienteTabelaPrecoList = clienteTabelaPrecoList.filter((e, indexx) => indexx != index)
        setFieldsValue({cliente: { clienteTabelaPrecoList }})
        this.setState({ viewStateTab: INSERTING })
    }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue } } = this.props
        const fields = getFieldsValue()
        fields.clienteTabelaPreco = {
            id: null,
            tabelaPreco: { id: null }
        }
        setFieldsValue(fields)
        this.setState({ viewStateTab: INSERTING })
    }

    handleChange = (value, option, property) => {
        this.setState({[property]: option.props.children})
    }

    getExtra() {
        const { viewStateTab } = this.state

        return (
            <>
                <Button type={"primary"} onClick={this.adicionar} >
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' }
                </Button>      
                &nbsp;      
                <Button type={"primary"} onClick={this.limpar} >
                       Limpar
                </Button>
            </>
        )
    }
    
    render() {
        const { 
            form: { getFieldDecorator, getFieldValue },
            cliente = {},
            tabelaPrecoList = []
        } = this.props
        const { clienteTabelaPrecoList = [] } = cliente || {}    

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        const id = getFieldValue("clienteTabelaPreco.id") || null
        
        return (<div>
            <Card title={"Informe os dados referente a Razão e clique no botão 'Adicionar'."} extra={this.getExtra()}>
                { getFieldDecorator("clienteTabelaPreco.id", { initialValue: id })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span = { 8 }>
                        <Form.Item label={"Tabela Preço"}>
                            {
                                getFieldDecorator('clienteTabelaPreco.tabelaPreco.id', {})(
                                    <Select showSearch
                                            optionFilterProp="children"
                                            placeholder={"Digite para buscar"}
                                            onChange={(value, option) => this.handleChange(value, option, 'descricao')}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            //onSearch={(nome = '') => nome.length > 3} // && produtoPesquisar({ nome, tipo: 'I' })}
                                            >
                                        {generateOptions(tabelaPrecoList)}
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>                            
            </Card>
            <Card title={getTitle("Tabela de Preços do CLiente")} style={{marginTop: '10px'}}>
                <Row gutter = { 12 }>
                    <Form.Item>
                        {
                            getFieldDecorator('cliente.clienteTabelaPrecoList', {
                                initialValue: [...clienteTabelaPrecoList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.clienteTabelaPreco} 
                                    size={"small"} 
                                    pagination={false}
                                    bordered>
                                    <Table.Column title={<center>Tabela Preço</center>} key={"tabelaPreco"} dataIndex={"tabelaPreco"} align={"center"} 
                                          render={(tabelaPreco = {}) => tabelaPreco.descricao || tabelaPreco.nome }/>
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record, index) => {
                                                    return <>
                                                            {/* {
                                                                record.id &&
                                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon> 
                                                            }
                                                            <Divider type="vertical"/> */}
                                                            {
                                                                <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(index) }/>
                                                            }
                                                        </>
                                                    }
                                                }/>
                                </Table>
                            )
                        }
                    </Form.Item>
                </Row>
            </Card>
        </div>)
    }
}