import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Switch } from 'antd'
import { generateOptions } from '../../../util/helper'
import { isNil } from 'lodash'
import moment from 'moment'
import { validarCPF } from '../../../util/validacaoUtil'
import NumericInput from '../../../util/numericInput'

const Option = Select.Option

const TabDados = (props) => {
    const validarCampoCPF = function (rule, value, callback) {
        if (value && !validarCPF(value)) {
            callback('CPF inválido!');
        } else {
            callback();
        }
    };

    const { 
        form: { getFieldDecorator, getFieldValue },
        funcionario = {},
        cargoList = []
    } = props
    const {
        nome,    
        cpf,
        ativo,  
        email,
        observacao,
        cargo
    } = funcionario || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 16 }>
                <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('funcionario.nome', {
                            rules: [{ required: true, whitespace: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>            
        </Row>
        <Row gutter={ 12 }>                         
            <Col span={ 8 }>
                <Form.Item label={"Cargo"}>
                    {
                        getFieldDecorator('funcionario.cargo.id', {
                            rules: [{ required: true, message: 'Por favor, informe a forma de pagamento.' }],
                            initialValue: isNil(cargo) ? null : cargo.id
                        })(
                            <Select showSearch
                                    placeholder={"Selecione"} 
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    allowClear>
                                {generateOptions(cargoList.map(({id, nome}) => ({id, descricao: nome})))}
                        </Select>
                        )
                    }
                </Form.Item>
            </Col> 
            <Col span={ 4 }>
                    <Form.Item label={"CPF"}>
                        {
                            getFieldDecorator('funcionario.cpf', {
                                rules: [
                                    { required: true, message: "Por favor, informe um CPF." },
                                    { validator: validarCampoCPF },
                                ],
                                initialValue: cpf
                            })(
                                <NumericInput maxLength={ 11 } />                                
                            )
                        }
                    </Form.Item>
            </Col>             
            <Col span={ 4 }>            
                <Form.Item label={"Ativo"}>
                {
                    getFieldDecorator('funcionario.ativo', {
                        initialValue: ativo || true,
                        valuePropName: 'checked'                                    
                    })(
                        <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                    )
                }
                </Form.Item>
            </Col>                                      
            <Col span={ 8 }>
                <Form.Item label={"Email"}>
                    {
                        getFieldDecorator('funcionario.email', {
                            rules: [{ required: false, whitespace: true, message: 'Por favor, informe o email.' }],
                            initialValue: email || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>            
        </Row>
        <Row gutter={12}>
            <Col span={24}>
                <Form.Item label={"Observação"}>
                    {
                        getFieldDecorator('funcionario.observacao', {
                            rules:[
                                {required: false, whitespace: true, message: 'A Observação é obrigatória.'},
                                {required: false, max: 800, message: 'A quantidade máxima de caracteres é 800.'}
                            ],
                            initialValue: observacao || null
                        })(<Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} 
                                            onInput={toInputUppercase}
                                            placeholder={"Coloque alguma observação"} />)
                    }  
                </Form.Item>                          
            </Col>
        </Row>         
    </div>)
}

export default TabDados