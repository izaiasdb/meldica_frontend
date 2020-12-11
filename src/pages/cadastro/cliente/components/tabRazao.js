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
            viewStateTab: INSERTING,
        };
    }

    adicionar = () => {
        const { form: { getFieldValue, setFieldsValue } } = this.props

        let clienteRazao = getFieldValue("clienteRazao")
        let error = false
        Object.keys(clienteRazao).forEach(key => {
            if(key != "id" &&
                (isNil(clienteRazao[key]) || isEmpty(trim(clienteRazao[key])))) {
                openNotification({tipo: 'warning', descricao: `Por favor, preencha o(a) ${key.toUpperCase()}.`})
                error = true
            }
        })

        if(clienteRazao.nomeFantasia && clienteRazao.nomeFantasia.length <= 1){
            openNotification({tipo: 'warning', descricao: 'Nome Fantasia precisa ser informado!'})
            error = true
        }        

        if(clienteRazao.cpfCnpj && clienteRazao.cpfCnpj.length < 1){
            openNotification({tipo: 'warning', descricao: 'Cpf/Cnpj precisa ser informado!'})
            error = true
        }        

        if(error) return null
                
        let clienteRazaoList = getFieldValue("cliente.clienteRazaoList")

        if (clienteRazao.id){
            let oldRegistro = clienteRazaoList.find(c=> c.id == clienteRazao.id)

            const index = clienteRazaoList.indexOf(oldRegistro);

            if (index > -1) {
              clienteRazaoList.splice(index, 1);
            }          
        }        

        clienteRazaoList.push(clienteRazao)
        this.limpar()
        setFieldsValue({
            cliente: { clienteRazaoList },
            clienteRazao: {
                id: null,
                ativo: true,
                idCliente: null,
                nomeFantasia: '',
                fisicaJuridica: '',
                cpfCnpj: '',
            }
        })
        this.setState({ viewStateTab: INSERTING })
    }

    prepareUpdate = (clienteRazao) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ clienteRazao: {...clienteRazao } } )
        this.setState({ viewStateTab: EDITING })
    }
    
    remover = (index) => {
        const { form: {getFieldValue, setFieldsValue } } = this.props
        let clienteRazaoList = getFieldValue("cliente.clienteRazaoList")
        clienteRazaoList = clienteRazaoList.filter((e, indexx) => indexx != index)
        setFieldsValue({cliente: { clienteRazaoList }})
        this.setState({ viewStateTab: INSERTING })
    }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue } } = this.props
        const fields = getFieldsValue()
        fields.clienteRazao = {
            id: null,
            ativo: true,
            idCliente: null,
            nomeFantasia: '',
            fisicaJuridica: '',
            cpfCnpj: '',
        }
        setFieldsValue(fields)
        this.setState({ viewStateTab: INSERTING })
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
        } = this.props
        const { clienteRazaoList = [] } = cliente || {}    

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        const id = getFieldValue("clienteRazao.id") || null
        
        return (<div>
            <Card title={"Informe os dados referente a Razão e clique no botão 'Adicionar'."} extra={this.getExtra()}>
                { getFieldDecorator("clienteRazao.id", { initialValue: id })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span={ 3 }>
                        <Form.Item label={"Tipo"}>
                            {
                                getFieldDecorator('clienteRazao.fisicaJuridica', {
                                    initialValue: 'J'
                                })(
                                <Select showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    <Option key={2} value={'F'}>{"FíSICA"}</Option>
                                    <Option key={3} value={'J'}>{"JURÍDICA"}</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 12 }>
                        <Form.Item label={"Nome Fantasia"}>
                            {
                                getFieldDecorator('clienteRazao.nomeFantasia', {
                                    rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome fantasia.' }],
                                    initialValue: null
                                })(
                                    <Input maxLength={ 200 } onInput={toInputUppercase} />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={ 4 }>
                        <Form.Item label={"CNPJ / CPF"}>
                            {
                                getFieldDecorator('clienteRazao.cpfCnpj', {
                                    rules: [
                                        { required: false, message: "Por favor, informe um CPF ou CNPJ." },
                                        //{ validator: validarCampoCPF },
                                    ],
                                    initialValue: null
                                })(
                                    <NumericInput maxLength={ 20 } />
                                )
                            }
                        </Form.Item>
                    </Col>   
                    <Col span={ 3 }>            
                        <Form.Item label={"Ativo"}>
                        {
                            getFieldDecorator('clienteRazao.ativo', {
                                initialValue: true,
                                valuePropName: 'checked'                                    
                            })(
                                <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                            )
                        }
                        </Form.Item>
                    </Col>   
                </Row>                            
            </Card>
            <Card title={getTitle("Razões Sociais")} style={{marginTop: '10px'}}>
                <Row gutter = { 12 }>
                    <Form.Item>
                        {
                            getFieldDecorator('cliente.clienteRazaoList', {
                                initialValue: [...clienteRazaoList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.clienteRazao} 
                                    size={"small"} 
                                    pagination={false}
                                    bordered>
                                    <Table.Column title={<center>Nome Fantasia</center>} key={"nomeFantasia"} dataIndex={"nomeFantasia"} align={"center"} />
                                    <Table.Column title={<center>Cpf/Cnpj</center>} key={"cpfCnpj"} dataIndex={"cpfCnpj"} align={"center"} />
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record, index) => {
                                                    return <>
                                                            {
                                                                record.id &&
                                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon> 
                                                            }
                                                            <Divider type="vertical"/>
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