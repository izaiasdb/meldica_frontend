import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Switch, Tooltip } from 'antd'
import { generateOptions } from '../../../util/helper'
import { isNil } from 'lodash'
import moment from 'moment'
import { validarCPF } from '../../../util/validacaoUtil'
import NumericInput from '../../../util/numericInput'

const Option = Select.Option

const TabDados = (props) => {
    const { 
        form: { getFieldDecorator, getFieldValue },
        unidadeMedidaList = [],
        tabelaPreco = {}
    } = props
    const {
        unidadeMedida = {},
        nome,        
        ativo,
    } = tabelaPreco || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 16 }>
                <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('tabelaPreco.nome', {
                            rules: [{ required: true, whitespace: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>                     
            <Col span={ 4 }>            
                <Form.Item label={"Ativo"}>
                {
                    getFieldDecorator('tabelaPreco.ativo', {
                        initialValue: isNil(ativo) ? true : ativo,
                        valuePropName: 'checked'                                    
                    })(
                        <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                    )
                }
                </Form.Item>
            </Col>                              
        </Row>
    </div>)
}

export default TabDados