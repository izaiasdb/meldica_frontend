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
        cliente = {}
    } = props
    const {
        nome,    
        dataNascimento,
        dataInicio,
        limiteCredito,
        nomeFantasia,    
        fisicaJuridica,
        cpfCnpj,
        inscricaoEstadual,
        prazoPagamento,
        ativo,  
        email,
        site,
        observacao 
    } = cliente || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 12 }>
                <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('cliente.nome', {
                            rules: [{ required: true, whitespace: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 4 }>
                <Form.Item label={"Data de Nascimento"}>
                    {
                        getFieldDecorator('cliente.dataNascimento', {
                            rules: [{ required: false, message: "Por favor, informe a data de nascimento."}],
                            initialValue: isNil(dataNascimento) ? null : new moment(dataNascimento)
                        })(
                            <DatePicker format={'DD/MM/YYYY'}/>
                        )
                    }
                </Form.Item>
            </Col> 
            <Col span={ 4 }>
                <Form.Item label={"Cliente desde"}>
                    {
                        getFieldDecorator('cliente.dataInicio', {
                            rules: [{ required: false, message: "Por favor, informe a data de nascimento."}],
                            initialValue: isNil(dataInicio) ? null : new moment(dataInicio)
                        })(
                            <DatePicker format={'DD/MM/YYYY'}/>
                        )
                    }
                </Form.Item>
            </Col>                        
            {/* <Col span={ 12 }>
                <Form.Item label={"Nome Fantasia"}>
                    {
                        getFieldDecorator('cliente.nomeFantasia', {
                            rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome fantasia.' }],
                            initialValue: nomeFantasia || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>   */}
        </Row>
        <Row gutter={ 12 }>                         
            <Col span={ 4 }>
                <Form.Item label={"Tipo Cliente"}>
                    {
                        getFieldDecorator('cliente.fisicaJuridica', {
                            rules: [{required: true, message: 'Por favor, informe o tipo do cliente.'}],
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
            <Col span={ 4 }>
                <Form.Item label={"CNPJ / CPF"}>
                    {
                        getFieldDecorator('cliente.cpfCnpj', {
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
                <Form.Item label={"Inscrição Estadual"}>
                    {
                        getFieldDecorator('cliente.inscricaoEstadual', {
                            rules: [
                                { required: false, message: "Por favor, informe um CPF ou CNPJ." },
                                //{ validator: validarCampoCPF },
                            ],
                            initialValue: inscricaoEstadual
                        })(
                            <Input maxLength={ 20 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>    
            <Col span={ 4 }>
                <Form.Item label={"Prazo de pagamento"}>
                    {
                        getFieldDecorator('cliente.prazoPagamento', {
                            rules: [
                                { required: false, message: "Por favor, informe um CPF ou CNPJ." },
                                //{ validator: validarCampoCPF },
                            ],
                            initialValue: prazoPagamento
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>             
            <Col span={ 3 }>
                <Form.Item label={"Limite de crédito"}>
                    {
                        getFieldDecorator('cliente.limiteCredito', {
                            rules: [{required: false, message: 'Por favor, informe o valor de compra.'}],
                            initialValue: limiteCredito || 0
                        })(
                            <InputNumber style={{ width: "150" }}
                                min={0}
                                precision={2}
                                step={1}
                                />
                        )
                    }
                </Form.Item>
            </Col>                    
            <Col span={ 2 }>            
                <Form.Item label={"Ativo"}>
                {
                    getFieldDecorator('cliente.ativo', {
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
                        getFieldDecorator('cliente.email', {
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
                        getFieldDecorator('cliente.site', {
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
                        getFieldDecorator('cliente.observacao', {
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