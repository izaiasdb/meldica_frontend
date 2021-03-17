import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider, Drawer, InputNumber, DatePicker  } from 'antd'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import moment from 'moment'

import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import create from '../../../../services/CepApi'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
//import NumericInput from '../../../util/numericInput'

const Option = Select.Option

export default class DrawerInfoCliente extends React.Component {
    constructor(props){
        super(props)
    }    

    render() {
        const { 
            clienteList = [],
            onCloseDrawerInfoCliente,
            drawerInfoClienteVisivel,
            idCliente
        } = this.props

        let cliente = clienteList.find(c=> c.id == idCliente)

        return (<div>
            <Drawer
                title="Cliente"
                width={"75%"}
                onClose={onCloseDrawerInfoCliente}
                visible={drawerInfoClienteVisivel}
                bodyStyle={{ paddingBottom: 80 }}
                >          
                    <Row gutter = { 12 }>
                        <Col span={ 16 }>
                            <Form.Item label={"Nome"}>
                                {
                                    <Input maxLength={ 200 } disabled value={cliente ? cliente.nome : ''} />
                                }
                            </Form.Item>
                        </Col>             
                    </Row> 
                    <Row gutter = { 12 }>
                        <Col span={ 4 }>
                            <Form.Item label={"Data de Nascimento"}>
                                {
                                    <DatePicker format={'DD/MM/YYYY'}
                                        value={!isNil(cliente) && !isNil(cliente.dataNascimento) ? new moment(cliente.dataNascimento) : null} 
                                        disabled
                                    />
                                }
                            </Form.Item>
                        </Col>    
                        <Col span={ 4 }>
                            <Form.Item label={"CPF / CNPJ"}>
                                {
                                    <Input value={!isNil(cliente) && !isNil(cliente.cpfCnpj) ? cliente.cpfCnpj : ''} disabled/>
                                }
                            </Form.Item>
                        </Col>            
                        <Col span={ 4 }>
                            <Form.Item label={"Inscrição Estadual"}>
                                {
                                    <Input value={!isNil(cliente) && !isNil(cliente.inscricaoEstadual) ? cliente.inscricaoEstadual : ''} disabled/>
                                }
                            </Form.Item>
                        </Col>    
                        <Col span={ 4 }>
                            <Form.Item label={"Prazo de Pagamento"}>
                                {
                                    <Input value={!isNil(cliente) && !isNil(cliente.prazoPagamento) ? cliente.prazoPagamento : ''} disabled/>
                                }
                            </Form.Item>
                        </Col>     
                        <Col span={ 4 }>
                            <Form.Item label={"Limite de crédito"}>
                                {
                                    <InputNumber style={{ width: "150" }}
                                        value={!isNil(cliente) && !isNil(cliente.limiteCredito) ? cliente.limiteCredito : ''}
                                        disabled
                                        min={0}
                                        precision={2}
                                        step={1}
                                        />
                                }
                            </Form.Item>
                        </Col>                                                                  
                    </Row> 
                    <Row gutter={12}>  
                        <Col span={ 16 }>
                            <Form.Item label={"Observação"}>
                                {
                                    <Input.TextArea 
                                        value={cliente ? cliente.observacao : ''}
                                        autoSize={{ minRows: 5, maxRows: 8 }} 
                                        disabled
                                        />
                                }
                            </Form.Item>
                        </Col>             
                    </Row>                     
            </Drawer>  
        </div>)
    }
}