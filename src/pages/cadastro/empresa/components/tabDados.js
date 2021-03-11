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
        empresa = {}
    } = props
    const {
        nome,    
        nomeFantasia,    
        fisicaJuridica,
        cpfCnpj,
        ativo,  
        email,
        site,
        observacao 
    } = empresa || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 12 }>
                <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('empresa.nome', {
                            rules: [{ required: true, whitespace: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 12 }>
                <Form.Item label={"Nome Fantasia"}>
                    {
                        getFieldDecorator('empresa.nomeFantasia', {
                            rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome fantasia.' }],
                            initialValue: nomeFantasia || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>  
        </Row>
        <Row gutter={ 12 }>                         
            <Col span={ 4 }>
                <Form.Item label={"Tipo Empresa"}>
                    {
                        getFieldDecorator('empresa.fisicaJuridica', {
                            rules: [{required: true, message: 'Por favor, informe o tipo da empresa.'}],
                            initialValue: fisicaJuridica || 'J'
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
            <Col span={ 6 }>
                <Form.Item label={"CNPJ / CPF"}>
                    {
                        getFieldDecorator('empresa.cpfCnpj', {
                            rules: [
                                { required: true, message: "Por favor, informe um CPF ou CNPJ." },
                                //{ validator: validarCampoCPF },
                            ],
                            initialValue: cpfCnpj
                        })(
                            <NumericInput maxLength={ 20 } />
                        )
                    }
                </Form.Item>
            </Col>             
            <Col span={ 4 }>            
                <Form.Item label={"Ativo"}>
                {
                    getFieldDecorator('empresa.ativo', {
                        initialValue: isNil(ativo) ? true : ativo,
                        valuePropName: 'checked'                                    
                    })(
                        <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                    )
                }
                </Form.Item>
            </Col>                              
        </Row>        
        <Row gutter={ 12 }>
            <Col span={ 12 }>
                <Form.Item label={"Email"}>
                    {
                        getFieldDecorator('empresa.email', {
                            rules: [{ required: false, whitespace: true, message: 'Por favor, informe o email.' }],
                            initialValue: email || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 12 }>
                <Form.Item label={"Site"}>
                    {
                        getFieldDecorator('empresa.site', {
                            rules: [{ required: false, whitespace: true, message: 'Por favor, informe o site.' }],
                            initialValue: site || null
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
                        getFieldDecorator('empresa.observacao', {
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