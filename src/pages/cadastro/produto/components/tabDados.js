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
        grupoProdutoList = [],
        empresaList = [],
        produto = {}
    } = props
    const {
        unidadeMedida = {},
        empresa = {},
        grupoProduto = {},
        nome,        
        ativo,
        fracionado,
        tipo,
        valorCompraUnidade,
        valorCompraCaixa,
        valorVendaUnidade,
        valorVendaCaixa,
        valorProducaoUnidade,
        valorProducaoCaixa,
        valorNfUnidade,
        valorNfCaixa, 
        pesoUnidade,
        pesoCaixa,
        qtdEstoqueUnidade,
        qtdEstoqueCaixa,      
        percDescontoMaximo,  
        atualizaEstoque,
        quantidadeCaixa   
    } = produto || {}

    let fracionadoForm = getFieldValue("produto.fracionado")

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

    return (<div>
        <Row gutter={ 12 }>
            <Col span={ 14 }>
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
                            rules: [{required: true, message: 'Por favor, informe o tipo do produto.'}],
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
            <Col span={ 3 }>            
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
            <Col span={ 3 }>            
                <Tooltip title='Se o produto pode ser vendido por unidades.' placement='left'>
                <Form.Item label={"Fracionado"}>
                {
                    getFieldDecorator('produto.fracionado', {
                        initialValue: isNil(fracionado) ? true : fracionado,
                        valuePropName: 'checked'                                    
                    })(
                        <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                    )
                }
                </Form.Item>
                </Tooltip>
            </Col> 
        </Row>
        <Row gutter={ 12 }>
            <Col span={ 6 }>
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
            <Col span={ 6 }>
                <Form.Item label={"Grupo Produto"}>
                    {
                        getFieldDecorator('produto.grupoProduto.id', {
                            rules: [{required: true, message: 'Por favor, informe o grupo do produto.'}],
                            initialValue: grupoProduto && grupoProduto.id ? grupoProduto.id : null
                        })(
                        <Select showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(grupoProdutoList.map(({id, nome: descricao}) => ({id, descricao})))}
                        </Select>
                        )
                    }
                </Form.Item>
            </Col>             
                   
            <Col span={ 6 }>
                <Form.Item label={"Empresa"}>
                    {
                        getFieldDecorator('produto.empresa.id', {
                            rules: [{required: true, message: 'Por favor, informe a empresa.'}],
                            initialValue: empresa && empresa.id ? empresa.id : null
                        })(
                        <Select showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(empresaList.map(({id, nome: descricao}) => ({id, descricao})))}
                        </Select>
                        )
                    }
                </Form.Item>
            </Col> 
        </Row>
        <Row gutter={ 12 }>            
            <Col span={ 3 }>
                <Form.Item label={"Valor Compra(Unit.)"}>
                    {
                        getFieldDecorator('produto.valorCompraUnidade', {
                            rules: [{required: true, message: 'Por favor, informe o valor de compra.'}],
                            initialValue: valorCompraUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={0}
                            precision={3}
                            step={1}
                            />
                        )
                    }
                </Form.Item>
            </Col> 
            <Col span={ 3 }>
                <Form.Item label={"Valor Venda(Unit.)"}>
                    {
                        getFieldDecorator('produto.valorVendaUnidade', {
                            rules: [{required: true, message: 'Por favor, informe o valor de venda.'}],
                            initialValue: valorVendaUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={0}
                            precision={3}
                            step={1}
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 4 }>
                <Form.Item label={"Valor Produção(Unit.)"}>
                    {
                        getFieldDecorator('produto.valorProducaoUnidade', {
                            rules: [{required: true, message: 'Por favor, informe o valor de produção.'}],
                            initialValue: valorProducaoUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            disabled
                            min={0}
                            precision={3}
                            step={1}                            
                            //formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            //parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        )
                    }
                </Form.Item>
            </Col>  
            <Col span={ 3 }>
                <Form.Item label={"Valor NF(Unit.)"}>
                    {
                        getFieldDecorator('produto.valorNfUnidade', {
                            rules: [{required: true, message: 'Por favor, informe o valor de NF.'}],
                            initialValue: valorNfUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }}                                                         
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>  
            <Col span={ 3 }>
                <Form.Item label={"Peso(Unit. em g)"}>
                    {
                        getFieldDecorator('produto.pesoUnidade', {
                            rules: [{required: true, message: 'Por favor, informe o peso.'}],
                            initialValue: pesoUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }}                                                         
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 3 }>
                <Form.Item label={"Estoque(Unit.)"}>
                    {
                        getFieldDecorator('produto.qtdEstoqueUnidade', {
                            rules: [{ required: false }],
                            initialValue: qtdEstoqueUnidade || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            // Deixar ativo por enquanto que não controla estoque
                            //disabled
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>                                                      
        </Row>
        <Row gutter={ 12 }>     
            <Col span={ 3 }>
                <Form.Item label={"Valor Compra(Caixa)"}>
                    {
                        getFieldDecorator('produto.valorCompraCaixa', {
                            rules: [{required: true, message: 'Por favor, informe o valor de compra da caixa.'}],
                            initialValue: valorCompraCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={0}
                            precision={3}
                            step={1}
                            />
                        )
                    }
                </Form.Item>
            </Col>   
            <Col span={ 3 }>
                <Form.Item label={"Valor Venda(caixa)"}>
                    {
                        getFieldDecorator('produto.valorVendaCaixa', {
                            rules: [{required: true, message: 'Por favor, informe o valor de venda da caixa.'}],
                            initialValue: valorVendaCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={0}
                            precision={3}
                            step={1}
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 4 }>
                <Form.Item label={"Valor Produção(Caixa)"}>
                    {
                        getFieldDecorator('produto.valorProducaoCaixa', {
                            rules: [{required: true, message: 'Por favor, informe o valor de produção.'}],
                            initialValue: valorProducaoCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            disabled
                            min={0}
                            precision={3}
                            step={1}                            
                            //formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            //parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 3 }>
                <Form.Item label={"Valor NF(Caixa)"}>
                    {
                        getFieldDecorator('produto.valorNfCaixa', {
                            rules: [{required: true, message: 'Por favor, informe o valor de NF.'}],
                            initialValue: valorNfCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }}                                                         
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 3 }>
                <Form.Item label={"Peso(Caixa em g)"}>
                    {
                        getFieldDecorator('produto.pesoCaixa', {
                            rules: [{required: true, message: 'Por favor, informe o peso.'}],
                            initialValue: pesoCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }}                                                         
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={ 3 }>
                <Form.Item label={"Estoque(Caixa)"}>
                    {
                        getFieldDecorator('produto.qtdEstoqueCaixa', {
                            rules: [{ required: false }],
                            initialValue: qtdEstoqueCaixa || 0
                        })(
                            <InputNumber style={{ width: "150" }} 
                            // Deixar ativo por enquanto que não controla estoque
                            //disabled
                            min={0}
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
            </Col>                                                                  
        </Row>
        <Row gutter={ 12 }>   
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
                            precision={3}
                            step={1}                            
                            />
                        )
                    }
                </Form.Item>
                </Tooltip>
            </Col>                   
             

            <Col span={ 3 }>
                <Form.Item label={"Quantidade na Caixa"}>
                    {
                        getFieldDecorator('produto.quantidadeCaixa', {
                            rules: [{required: true, message: 'Por favor, informe a quantidade em uma caixa.'}],
                            initialValue: quantidadeCaixa || 12
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