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
        produto = {}
    } = props
    const {
        unidadeMedida = {},
        nome,        
        ativo,
        tipo,
        valorCompra,
        valorVenda,
        valorProducao,
        valorNf,
        qtdEstoque,        
        percDescontoMaximo,  
        atualizaEstoque,
        quantidadeCaixa   
    } = produto || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 16 }>
                <Form.Item label={"Nome"}>
                    {
                        getFieldDecorator('produto.nome', {
                            rules: [{ required: true, whitespace: true, message: 'Por favor, informe o nome.' }],
                            initialValue: nome || null
                        })(
                            <Input maxLength={ 200 } onInput={toInputUppercase} />
                        )
                    }
                </Form.Item>
            </Col>                     
            <Col span={ 4 }>
                <Tooltip title='Insumo(ex: Tampa, Rôtulo), Produto(ex: Extrato), Combinado(ex: Caixa Extrato)' placement='left'>
                <Form.Item label={"Tipo Produto"}>
                    {
                        getFieldDecorator('produto.tipo', {
                            rules: [{required: true, message: 'Por favor, informe o sexo.'}],
                            initialValue: tipo || 'P'
                        })(
                        <Select showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                <Option key={2} value={'I'}>{"INSUMO"}</Option>
                                <Option key={3} value={'P'}>{"PRODUTO"}</Option>                                
                                <Option key={4} value={'C'}>{"COMBINADO"}</Option>
                        </Select>
                        )
                    }
                </Form.Item>
                </Tooltip>
            </Col> 
            <Col span={ 4 }>            
                <Form.Item label={"Ativo"}>
                {
                    getFieldDecorator('produto.ativo', {
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
                <Form.Item label={"Unidade Medidda"}>
                    {
                        getFieldDecorator('produto.unidadeMedida.id', {
                            rules: [{required: true, message: 'Por favor, informe a unidade de medida.'}],
                            initialValue: unidadeMedida && unidadeMedida.id ? unidadeMedida.id : 1
                        })(
                        <Select showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(unidadeMedidaList.map(({id, nome: descricao}) => ({id, descricao})))}
                        </Select>
                        )
                    }
                </Form.Item>
            </Col>           
            <Col span={ 3 }>
                <Form.Item label={"Valor Compra"}>
                    {
                        getFieldDecorator('produto.valorCompra', {
                            rules: [{required: true, message: 'Por favor, informe o valor de compra.'}],
                            initialValue: valorCompra || 0
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
            <Col span={ 3 }>
                <Form.Item label={"Valor Venda"}>
                    {
                        getFieldDecorator('produto.valorVenda', {
                            rules: [{required: true, message: 'Por favor, informe o valor de venda.'}],
                            initialValue: valorVenda || 0
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
            <Col span={ 5 }>
                <Tooltip title='Máximo de desconto que pode ser dado para esse produto.' placement='left'>                            
                <Form.Item label={"Perc.(%) máx. de Desconto"}>
                    {
                        getFieldDecorator('produto.percDescontoMaximo', {
                            rules: [{required: true, message: 'Por favor, informe o percentual máximo de Desconto.'}],
                            initialValue: percDescontoMaximo || 0
                        })(
                            <InputNumber //style={{ width: "150" }}                                                         
                            min={0}
                            max={100}
                            precision={2}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
                </Tooltip>
            </Col>                         
        </Row>
        <Row gutter={ 12 }>            
            <Col span={ 3 }>
                <Form.Item label={"Valor NF"}>
                    {
                        getFieldDecorator('produto.valorNf', {
                            rules: [{required: true, message: 'Por favor, informe o valor de NF.'}],
                            initialValue: valorNf || 0
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
            <Col span={ 3 }>
                <Form.Item label={"Valor Produção"}>
                    {
                        getFieldDecorator('produto.valorProducao', {
                            rules: [{required: true, message: 'Por favor, informe o valor de produção.'}],
                            initialValue: valorProducao || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            disabled
                            min={0}
                            precision={2}
                            step={1}                            
                            //formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            //parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        )
                    }
                </Form.Item>
            </Col>   
            <Col span={ 4 }>
                <Form.Item label={"Estoque"}>
                    {
                        getFieldDecorator('produto.qtdEstoque', {
                            rules: [{ required: false }],
                            initialValue: qtdEstoque || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            disabled
                            min={0}
                            precision={2}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 3 }>
                <Form.Item label={"Quantidade na Caixa"}>
                    {
                        getFieldDecorator('produto.quantidadeCaixa', {
                            rules: [{required: true, message: 'Por favor, informe a quantidade em uma caixa.'}],
                            initialValue: quantidadeCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }}                                                         
                            min={0}
                            precision={0}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>             
            {/* <Col span={ 4 }>            
                <Form.Item label={"Atualiza estoque"}>
                {
                    getFieldDecorator('produto.atualizaEstoque', {
                        initialValue: isNil(atualizaEstoque) ? true : atualizaEstoque,
                        valuePropName: 'checked'                                    
                    })(
                        <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                    )
                }
                </Form.Item>
            </Col>              */}
        </Row>  
    </div>)
}

export default TabDados