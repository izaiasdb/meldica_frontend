import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Switch, Card  } from 'antd'
import { generateOptions } from '../../../util/helper'
import { isNil, isEqual } from 'lodash'
import moment from 'moment'
import { validarCPF } from '../../../util/validacaoUtil'
import NumericInput from '../../../util/numericInput'
import { VIEWING } from '../../../util/state'

const Option = Select.Option

const TabDados = (props) => {
    const validateDataOrdemServico = function(rule, value, callback) {
        const { form } = this.props
        //const dataMovimentacao = form.getFieldValue("ordemServico.dataOrdemServico")
        let now = moment();

        if(isNil(value)){
            callback("Por favor, preencha o campo 'Data da ordemServico.'")
        }

        if(value.isSameOrAfter(now)) {
            callback("A Data da ordemServico não pode ser uma data futura.")
        }
    }

    const { 
        form: { getFieldDecorator, getFieldValue, getFieldsValue },
        ordemServico = {},
        clienteList = [],
        funcionarioList = [],
        tabelaPrecoList = [],
        stateView,
    } = props
    const {
        cliente = {},
        funcionario = {},
        dataOrdemServico,
        dataPrevisaoEntrega,
        observacao,        
    } = ordemServico || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Card title={"Informe os dados referente a Ordem de Serviço"}>
            <Row gutter={ 12 }>
                <Col span={ 10 }>
                    <Form.Item label={"Cliente"}>
                        {
                            getFieldDecorator('ordemServico.cliente.id', {
                                rules: [{required: true, message: 'Por favor, informe o cliente.'}],
                                initialValue: isNil(cliente) ? null : cliente.id
                            })(
                            <Select 
                                showSearch
                                disabled= {isEqual(stateView, VIEWING)}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(clienteList)}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={ 4 }>
                    <Form.Item label={"Data da venda"}>
                        {
                            getFieldDecorator('ordemServico.dataVenda', {
                                rules: [{required: true, message: "Por favor, informe a data da venda."}
                                //{ validator: validateDataOrdemServico}
                            ], initialValue: isNil(dataOrdemServico) ? moment() : new moment(dataOrdemServico)
                            })(
                                <DatePicker 
                                    style = {{ width: '98%' }}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col> 
                <Col span={ 4 }>
                    <Form.Item label={"Previsão entrega"}>
                        {
                            getFieldDecorator('ordemServico.dataPrevisaoEntrega', {
                                rules: [{required: false, message: "Por favor, informe a data da venda."}
                                //{ validator: validateDataOrdemServico}
                            ], initialValue: isNil(dataPrevisaoEntrega) ? moment() : new moment(dataPrevisaoEntrega)
                            })(
                                <DatePicker 
                                    style = {{ width: '98%' }}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col>                           
            </Row>   
            <Row gutter={12}>
                <Col span={ 10 }>
                    <Form.Item label={"Vendedor"}>
                        {
                            getFieldDecorator('ordemServico.funcionario.id', {
                                rules: [{required: true, message: 'Por favor, informe o Vendedor.'}],
                                initialValue: isNil(funcionario) ? null : funcionario.id
                            })(
                            <Select 
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled= {isEqual(stateView, VIEWING)}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(funcionarioList)}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col> 
                <Col span={ 10 }>
                    <Form.Item label={"Tabela de Preço"}>
                        {
                            getFieldDecorator('ordemServico.tabelaPreco.id', {
                                rules: [{required: true, message: 'Por favor, informe a Tabela de Preço.'}],
                                initialValue: isNil(funcionario) ? null : funcionario.id
                            })(
                            <Select 
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled= {isEqual(stateView, VIEWING)}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(tabelaPrecoList)}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col>                
            </Row>   
            <Row gutter={12}>
                <Col span={24}>
                    <Form.Item label={"Observação"}>
                        {
                            getFieldDecorator('ordemServico.observacao', {
                                rules:[
                                    {required: false, whitespace: true, message: 'A Observação é obrigatória.'},
                                    {required: false, max: 800, message: 'A quantidade máxima de caracteres é 800.'}
                                ],
                                initialValue: observacao || null
                            })(<Input.TextArea 
                                    autoSize={{ minRows: 5, maxRows: 8 }} 
                                    onInput={toInputUppercase}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    placeholder={"Coloque alguma observação"} />)
                        }  
                    </Form.Item>                          
                </Col>
            </Row>   
        </Card>      
    </div>)
}

export default TabDados