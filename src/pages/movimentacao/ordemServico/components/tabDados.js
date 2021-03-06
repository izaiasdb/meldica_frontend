import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Switch, Card, Button, Icon, Tooltip  } from 'antd'
import { generateOptions } from '../../../util/helper'
import { isNil, isEqual } from 'lodash'
import moment from 'moment'
import { validarCPF } from '../../../util/validacaoUtil'
import NumericInput from '../../../util/numericInput'
import { VIEWING } from '../../../util/state'
import { getUser } from '../../../../services/authenticationService'

const Option = Select.Option

const TabDados = (props) => {
    const validateDataOrdemServico = function(rule, value, callback) {
        const { form } = this.props
        //const dataMovimentacao = form.getFieldValue("ordemServico.dataVenda")
        let now = moment();

        if(isNil(value)){
            callback("Por favor, preencha o campo 'Data da ordemServico.'")
        }

        if(value.isSameOrAfter(now)) {
            callback("A Data da ordemServico não pode ser uma data futura.")
        }
    }

    const handleClienteChange = function() {
        const {form: { getFieldsValue, setFieldsValue } } = props
        const fields = getFieldsValue()
        fields.ordemServico.idClienteRazao = null
        fields.ordemServico.idClienteEndereco = null
        fields.ordemServico.tabelaPreco.id = null
        setFieldsValue({...fields})
    }

    const { 
        form: { getFieldDecorator, getFieldValue, getFieldsValue },
        ordemServico = {},
        clienteList = [],
        funcionarioList = [],
        tabelaPrecoList = [],
        clienteRazaoList = [],
        planoContaList = [],
        configuracaoList = [],
        clienteTabelaPrecoList = [],
        stateView,
        showDrawer,
        showDrawerInfoCliente,
        showDrawerUltimaCompraCliente,
    } = props
    const {
        cliente = {},
        planoConta = {},
        funcionario = {},
        tabelaPreco = {},
        idClienteRazao,
        dataVenda,
        dataLiberacao,
        dataPrevisaoEntrega,
        dataEntrega,
        observacao, 
        nfMeldica,
        nfCosmetico,       
    } = ordemServico || {}
    const { funcionario: funcionarioUser} = getUser()
    const { id: idFuncionarioUser } = funcionarioUser || {}

    const idCliente = getFieldValue("ordemServico.cliente.id") || (isNil(cliente) ? null : cliente.id)
    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
    let idPlanoContaOrdemServico = null
    
    if (configuracaoList.length > 0) {
        idPlanoContaOrdemServico = configuracaoList[0].planoContaOrdemServico.id;
    }
    
    //let clienteTabelaPrecoFilteredList = clienteTabelaPrecoList.filter(c=> c.idCliente == idCliente)
    //let tabelaPrecoFilteredList = []

    // if (clienteTabelaPrecoFilteredList.length > 0) {
    //     tabelaPrecoFilteredList = tabelaPrecoList.filter((a) => {
    //         return clienteTabelaPrecoFilteredList.some((f) => {
    //             return f.tabelaPreco.id === a.id;
    //         });
    //     });        
    // }

    const clienteEscolhido = clienteList.find(c => c.id == idCliente)

    return (<div>
        <Card title={"Informe os dados referente ao Pedido"}>
            <Row gutter={ 12 }>
                <Col span={ 12 }>
                    <Form.Item label={"Plano de Conta"}>
                        {
                            getFieldDecorator('ordemServico.planoConta.id', {
                                rules: [{required: true, message: 'Por favor, informe o plano de conta.'}],
                                initialValue: idPlanoContaOrdemServico//isNil(planoConta) ? idPlanoContaOrdemServico : planoConta.id
                            })(
                            <Select 
                                showSearch
                                //disabled= {isEqual(stateView, VIEWING)}
                                disabled
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(planoContaList)}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col>  
                <Col span={ 3 }>
                    <Form.Item label={"Data da venda"}>
                        {
                            getFieldDecorator('ordemServico.dataVenda', {
                                rules: [{required: true, message: "Por favor, informe a data da venda."}
                                //{ validator: validateDataOrdemServico}
                            ], initialValue: isNil(dataVenda) ? moment() : new moment(dataVenda)
                            })(
                                <DatePicker 
                                    style = {{ width: '98%' }}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col> 
                <Col span={ 3 }>
                    <Form.Item label={"Previsão entrega"}>
                        {
                            getFieldDecorator('ordemServico.dataPrevisaoEntrega', {
                                rules: [{required: false, message: "Por favor, informe a data da entrega."}
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
                <Col span={ 3 }>
                    <Form.Item label={"Data liberação"}>
                        {
                            getFieldDecorator('ordemServico.dataLiberacao', {
                                rules: [{required: false, message: "Por favor, informe a data da liberação."}
                                //{ validator: validateDataOrdemServico}
                            ], initialValue: isNil(dataLiberacao) ? null : new moment(dataLiberacao)
                            })(
                                <DatePicker 
                                    style = {{ width: '98%' }}
                                    disabled= {isEqual(stateView, VIEWING)}
                                    format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col>                
                <Col span={ 3 }>
                    <Form.Item label={"Data entrega"}>
                        {
                            getFieldDecorator('ordemServico.dataEntrega', {
                                rules: [{required: false, message: "Por favor, informe a data da venda."}
                                //{ validator: validateDataOrdemServico}
                            ], initialValue: isNil(dataEntrega) ? null : new moment(dataEntrega)
                            })(
                                <DatePicker 
                                    style = {{ width: '98%' }}
                                    //disabled
                                    disabled= {isEqual(stateView, VIEWING)}
                                    format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col>                   
            </Row>              
            <Row gutter={ 12 }>
                <Col span={ 8 }>
                    <Form.Item label={"Cliente"}>
                        {
                            getFieldDecorator('ordemServico.cliente.id', {
                                rules: [{required: true, message: 'Por favor, informe o cliente.'}],
                                initialValue: isNil(cliente) ? null : cliente.id
                            })(
                            <Select 
                                showSearch
                                disabled= {isEqual(stateView, VIEWING)}
                                onChange={() => handleClienteChange()} 
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
                <Col span={ 1 }>
                    <Tooltip title='Mais informações sobre o cliente' placement='left'>
                        <Button type="primary" onClick={showDrawerInfoCliente} style={{ marginTop: "40px" }}>
                            <Icon type="plus" />
                        </Button>
                    </Tooltip>
                </Col>
                <Col span={ 1 }>
                    <Tooltip title='Última compra do cliente' placement='left'>
                        <Button type="primary" onClick={showDrawerUltimaCompraCliente} style={{ marginTop: "40px" }}>
                            <Icon type="plus" />
                        </Button>
                    </Tooltip>                    
                </Col>                
                <Col span={ 8 }>
                    <Form.Item label={"Cliente Razão Social"}>
                        {
                            getFieldDecorator('ordemServico.idClienteRazao', {
                                rules: [{required: false, message: 'Por favor, informe a razão social do cliente.'}],
                                initialValue: isNil(idClienteRazao) ? null : idClienteRazao
                            })(
                            <Select 
                                showSearch
                                disabled= {isEqual(stateView, VIEWING)}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {generateOptions(idCliente && clienteRazaoList.filter(c=> c.idCliente == idCliente)
                                    .map(({id, nomeFantasia}) => ({id, descricao: nomeFantasia})))}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={ 3 }>
                    <Form.Item label={"NF Méldica"}>
                        {
                            getFieldDecorator('ordemServico.nfMeldica', {
                                rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome.' }],
                                initialValue: nfMeldica || null
                            })(
                                <Input maxLength={ 20 } onInput={toInputUppercase} />
                            )
                        }
                    </Form.Item>
                </Col>                             
            </Row>   
            {/* <Row gutter={12}>                
                <Col span={ 4 }>
                    <Form.Item label={"CPF / CNPJ"}>
                        {
                            <Input value={!isNil(clienteEscolhido) && !isNil(clienteEscolhido.cpfCnpj) ? clienteEscolhido.cpfCnpj : ''} disabled/>
                        }
                    </Form.Item>
                </Col>            
                <Col span={ 4 }>
                    <Form.Item label={"Inscrição Estadual"}>
                        {
                            <Input value={!isNil(clienteEscolhido) && !isNil(clienteEscolhido.inscricaoEstadual) ? clienteEscolhido.inscricaoEstadual : ''} disabled/>
                        }
                    </Form.Item>
                </Col>                          
            </Row>    */}
            <Row gutter={12}>
                <Col span={ 8 }>
                    <Form.Item label={"Vendedor"}>
                        {
                            getFieldDecorator('ordemServico.funcionario.id', {
                                rules: [{required: true, message: 'Por favor, informe o Vendedor.'}],
                                initialValue: !isNil(funcionario) && !isNil(funcionario.id) ? funcionario.id : idFuncionarioUser
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
                <Col span={ 8 }>
                    <Form.Item label={"Tabela de Preço"}>
                        {
                            getFieldDecorator('ordemServico.tabelaPreco.id', {
                                rules: [{required: true, message: 'Por favor, informe a Tabela de Preço.'}],
                                initialValue: isNil(tabelaPreco) ? null : tabelaPreco.id
                            })(
                            <Select 
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled= {isEqual(stateView, VIEWING)}
                                >
                                <Option key={1} value={null}>{"Selecione"}</Option>
                                {/* {generateOptions(tabelaPrecoFilteredList)} */}
                                {generateOptions(tabelaPrecoList)}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col> 
                <Col span={ 4 }>
                    <Button type="primary" 
                        onClick={showDrawer} 
                        style={{ marginTop: "40px" }}>
                        <Icon type="plus" /> Ver tabela Preço
                    </Button>
                </Col>
                <Col span={ 4 }>
                    <Form.Item label={"NF Cosmético"}>
                        {
                            getFieldDecorator('ordemServico.nfCosmetico', {
                                rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome.' }],
                                initialValue: nfCosmetico || null
                            })(
                                <Input maxLength={ 20 } onInput={toInputUppercase} />
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