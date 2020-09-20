import React, { Component } from 'react'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider } from 'antd'
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

        let telefone = getFieldValue("telefone")
        let error = false
        Object.keys(telefone).forEach(key => {
            if(key != "id" &&
                (isNil(telefone[key]) || isEmpty(trim(telefone[key])))) {
                openNotification({tipo: 'warning', descricao: `Por favor, preencha o(a) ${key.toUpperCase()}.`})
                error = true
            }
        })

        if(telefone.ddd && telefone.ddd.length <= 1){
            openNotification({tipo: 'warning', descricao: 'DDD precisa ser 2 digitos!'})
            error = true
        }        

        if(telefone.numero && telefone.numero.length < 8){
            openNotification({tipo: 'warning', descricao: 'Telefone precisa ter no mínimo 8 digitos!'})
            error = true
        }        

        if(error) return null
                
        let funcionarioTelefoneList = getFieldValue("funcionario.funcionarioTelefoneList")

        if (telefone.id){
            let oldRegistro = funcionarioTelefoneList.find(c=> c.id == telefone.id)

            const index = funcionarioTelefoneList.indexOf(oldRegistro);

            if (index > -1) {
              funcionarioTelefoneList.splice(index, 1);
            }          
        }        

        funcionarioTelefoneList.push(telefone)
        this.limpar()
        setFieldsValue({
            funcionario: { funcionarioTelefoneList },
            endereco: {
                id: null,
                //tipoTelefone: { id: 2},                
                idTipoTelefone: 1,
                ddd: '',
                numero: '',
            }
        })
        this.setStateView({ viewStateTab: INSERTING })
    }

    prepareUpdate = (telefone) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ telefone: {...telefone } } )
        this.setStateView({ viewStateTab: EDITING })
    }
    
    remover = (index) => {
        const { form: {getFieldValue, setFieldsValue } } = this.props
        let funcionarioTelefoneList = getFieldValue("funcionario.funcionarioTelefoneList")
        funcionarioTelefoneList = funcionarioTelefoneList.filter((e, indexx) => indexx != index)
        setFieldsValue({funcionario: { funcionarioTelefoneList }})
        this.setStateView({ viewStateTab: INSERTING })
    }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue } } = this.props
        const fields = getFieldsValue()
        fields.telefone = {
            id: null,
            //tipoTelefone: { id: 2},
            idTipoTelefone: 1,
            ddd: '',
            numero: '',
        }
        setFieldsValue(fields)
    }

    getExtra() {
        const { viewStateTab } = this.state

        return (
            <>
                <Button type={"primary"} onClick={this.limpar} >
                       Limpar
                </Button>
                &nbsp;
                <Button type={"primary"} onClick={this.adicionar} >
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' }
                </Button>
            </>
        )
    }
    
    render() {
        const { 
            form: { getFieldDecorator, getFieldValue },
            funcionario = {},
            tipoTelefone = [{
                id: 1,
                descricao: "FIXO"
            },{
                id: 2,
                descricao: "CELULAR"
            }],
        } = this.props
        const { funcionarioTelefoneList = [] } = funcionario || {}    

        const tipoTel = getFieldValue("telefone.tipoTelefone") || {}
        const id = getFieldValue("telefone.id") || null
        
        return (<div>
            <Card title={"Informe os dados referente ao telefone e clique no botão 'Adicionar'."} extra={this.getExtra()}>
                { getFieldDecorator("telefone.id", { initialValue: id })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span={ 4 }>
                        <Form.Item label={"Tipo de Telefone"}>
                            {
                                getFieldDecorator('telefone.idTipoTelefone', {
                                    initialValue: 2
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                generateOptions(tipoTelefone)
                                            }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 3 }>
                        <Form.Item label={"DDD"}>
                            {
                                getFieldDecorator('telefone.ddd', {
                                    initialValue: null
                                })( <NumericInput maxLength={ 2 }  /> )
                            }
                        </Form.Item>
                    </Col>            
                    <Col span={ 6 }>
                        <Form.Item label={"Telefone"}>
                            {
                                getFieldDecorator('telefone.numero', {
                                    initialValue: null
                                })(<NumericInput maxLength={ tipoTel.id == 1 ? 8 : 9 } />)
                            }
                        </Form.Item>
                    </Col>     
                </Row>                            
            </Card>
            <Card title={getTitle("Telefones")} style={{marginTop: '10px'}}>
                <Row gutter = { 12 }>
                    <Form.Item>
                        {
                            getFieldDecorator('funcionario.funcionarioTelefoneList', {
                                initialValue: [...funcionarioTelefoneList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.telefone} 
                                    size={"small"} 
                                    pagination={false}
                                    bordered>
                                    <Table.Column title={<center>Tipo</center>} 
                                                key={"idTipoTelefone"} 
                                                dataIndex={"idTipoTelefone"} 
                                                align={"center"} 
                                                render={ (text) => tipoTelefone.map(d => { if(d.id == text) return d.descricao }) }
                                                />
                                    <Table.Column title={<center>DDD</center>} key={"ddd"} dataIndex={"ddd"} align={"center"} />
                                    <Table.Column title={<center>Telefone</center>} key={"numero"} dataIndex={"numero"} align={"center"} />
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