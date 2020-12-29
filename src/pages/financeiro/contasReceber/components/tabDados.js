import React from 'react'
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Switch, Card, Radio } from 'antd'
import { generateOptions } from '../../../util/helper'
import { isNil, isEqual } from 'lodash'
import moment from 'moment'
import { EDITING, INSERTING, VIEWING} from '../../../util/state'

const Option = Select.Option

const TabDados = (props) => {
    const validateDataContasReceber = function(rule, value, callback) {
        const { form } = this.props
        //const dataMovimentacao = form.getFieldValue("contasReceber.dataContasReceber")
        let now = moment();

        if(isNil(value)){
            callback("Por favor, preencha o campo 'Data da contasReceber.'")
        }

        if(value.isSameOrAfter(now)) {
            callback("A Data da contasReceber não pode ser uma data futura.")
        }
    }

    const { 
        form: { getFieldDecorator, getFieldValue, getFieldsValue },
        contasReceber = {},
        clienteList = [],
        fornecedorList = [],
        planoContaList = [],
        formaCondicaoList = [],
        stateView,
        tipoTela,
    } = props
    const {
        cliente = {},
        fornecedor = {},
        planoConta = {},
        documento,
        descricao,
        ano, 
        mes,
        dataVencimento,
        observacao,  
        valor,      
    } = contasReceber || {}

    const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
    let idTipoLancamento = getFieldValue('contasReceber.tipoLancamento')

    let date = new moment();

    return (<div>
        <Card title={`Informe os dados referente a Contas a ${isEqual(tipoTela, 'PAGAR') ? 'pagar': 'receber'}`}>
            <Row gutter={ 12 }>
                { (isEqual(stateView, EDITING) || isEqual(stateView, VIEWING)) && !isNil(cliente) &&
                <Col span={ 12 }>
                    { isEqual(tipoTela, 'PAGAR') &&
                    <Form.Item label={"Cliente"}>
                        {
                            getFieldDecorator('contasReceber.cliente.id', {
                                rules: [{required: false, message: 'Por favor, informe o cliente.'}],
                                initialValue: isNil(cliente) ? null : cliente.id
                            })(
                            <Select showSearch
                                    disabled = {true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    {generateOptions(clienteList)}
                            </Select>
                            )
                        }
                    </Form.Item> }
                    { isEqual(tipoTela, 'RECEBER') &&
                    <Form.Item label={"Fornecedor"}>
                        {
                            getFieldDecorator('contasReceber.fornecedor.id', {
                                rules: [{required: false, message: 'Por favor, informe o fornecedor.'}],
                                initialValue: isNil(fornecedor) ? null : fornecedor.id
                            })(
                            <Select showSearch
                                    disabled = {true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    {generateOptions(fornecedorList)}
                            </Select>
                            )
                        }
                    </Form.Item> }                    
                </Col>
                }
                <Col span={ 12 }>
                    <Form.Item label={"Plano de Conta"}>
                        {
                            getFieldDecorator('contasReceber.planoConta.id', {
                                rules: [{required: true, message: 'Por favor, informe o Plano de Conta.'}],
                                initialValue: isNil(planoConta) ? null : planoConta.id
                            })(
                            <Select showSearch
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    <Option key={1} value={null}>{"Selecione"}</Option>
                                    {generateOptions(planoContaList.filter(c=> c.receitaDespesa == (isEqual(tipoTela, 'PAGAR') ? 'D' : 'R') ))}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Col>                
            </Row>   
            <Row gutter={12}>
                <Col span={ 12 }>
                    <Form.Item label={"Documento"}>
                        {
                            getFieldDecorator('contasReceber.documento', {
                                rules: [{ required: true, whitespace: true, message: 'Por favor, informe o documento.' }],
                                initialValue: documento || null
                            })(
                                <Input 
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                    maxLength={ 200 } onInput={toInputUppercase} />
                            )
                        }
                    </Form.Item>
                </Col> 
                <Col span={ 12 }>
                    <Form.Item label={"Descrição"}>
                        {
                            getFieldDecorator('contasReceber.descricao', {
                                rules: [{ required: true, whitespace: true, message: 'Por favor, informe a descrição.' }],
                                initialValue: descricao || null
                            })(
                                <Input 
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                    maxLength={ 200 } onInput={toInputUppercase} />
                            )
                        }
                    </Form.Item>
                </Col>                                 
            </Row>   
            <Row gutter={12}>
                <Col span={ 3 }>
                    <Form.Item label={"Mês competência"}>
                        {
                            getFieldDecorator('contasReceber.mes', {
                                rules: [{required: true, message: 'Por favor, informe o mês da competência.'}],
                                initialValue: mes || date.month() + 1
                            })(
                                <InputNumber style={{ width: "150" }}  
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                    min={1}
                                    max={12}
                                    precision={0}
                                    step={1}                            
                                    />
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={ 3 }>
                    <Form.Item label={"Ano competência"}>
                        {
                            getFieldDecorator('contasReceber.ano', {
                                rules: [{required: true, message: 'Por favor, informe o ano de competência.'}],
                                initialValue: ano || date.year()
                            })(
                                <InputNumber style={{ width: "150" }}     
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}                                                    
                                    min={2000}
                                    max={2050}
                                    precision={0}
                                    step={1}                            
                                    />
                            )
                        }
                    </Form.Item>
                </Col> 
                <Col span={ 4 }>
                    <Form.Item label={"Data do Vencimento"}>
                        {
                            getFieldDecorator('contasReceber.dataVencimento', {
                                rules: [{required: true, message: "Por favor, informe a data do vencimento."}
                                //{ validator: validateDataContasReceber}
                            ], initialValue: isNil(dataVencimento) ? moment() : new moment(dataVencimento)
                            })(
                                <DatePicker style = {{ width: '98%' }}
                                            disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                            format={'DD/MM/YYYY'}/>
                            )
                        }
                    </Form.Item>                
                </Col> 
                <Col span={ 3 }>
                    <Form.Item label={"Valor"}>
                        {
                            getFieldDecorator('contasReceber.valor', {
                                rules: [{required: true, message: 'Por favor, informe o valor do documento.'}],
                                initialValue: valor || 0
                            })(
                                <InputNumber style={{ width: "150" }}        
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}                                                 
                                    min={0}
                                    precision={2}
                                    step={1}                            
                                    />
                            )
                        }
                    </Form.Item>
                </Col>                                                                     
            </Row>
            <Row gutter={12}>
                <Col span={24}>
                    <Form.Item label={"Observação"}>
                        {
                            getFieldDecorator('contasReceber.observacao', {
                                rules:[
                                    {required: false, whitespace: true, message: 'A Observação é obrigatória.'},
                                    {required: false, max: 800, message: 'A quantidade máxima de caracteres é 800.'}
                                ],
                                initialValue: observacao || null
                            })(<Input.TextArea 
                                    disabled= {isEqual(stateView, VIEWING) || isEqual(stateView, 'PAGAR')}
                                    autoSize={{ minRows: 5, maxRows: 8 }} 
                                    onInput={toInputUppercase}
                                    placeholder={"Coloque alguma observação"} />)
                        }  
                    </Form.Item>                          
                </Col>
            </Row>   
            { isEqual(stateView, INSERTING) &&
            <Row gutter={ 22 }>
                <Col span={ 12 }>
                    <Form.Item label={"Escolha o tipo de lançamento"}>
                        {
                            getFieldDecorator('contasReceber.tipoLancamento', {
                                initialValue: 0
                            })(
                                <Radio.Group>
                                    <Radio key={1} value={0}>Lançamento Normal</Radio>
                                    <Radio key={2} value={1}>Lançamento à vista</Radio>
                                    {/* <Radio key={3} value={2}>Lançamento várias parcelas</Radio> */}
                                </Radio.Group>
                            )
                        }
                    </Form.Item>
                </Col>
                { 
                idTipoLancamento == 2 &&
                <>
                {/* <Col span={ 2 }>
                    <Form.Item label={"Parcelas"}>
                        {
                            getFieldDecorator('contasReceber.parcelas', {
                                rules: [{required: false, message: 'Por favor, informe as parcelas.'}],
                                initialValue: 1
                            })(
                                <InputNumber style={{ width: "150" }}                                                         
                                    min={2}
                                    max={24}
                                    precision={0}
                                    step={1}                            
                                    />
                            )
                        }
                    </Form.Item>
                </Col>  */}
                <Col span = { 10 }>
                    <Form.Item label={`Forma condição de ${isEqual(tipoTela, 'PAGAR') ? 'pagamento' : 'recebimento'} `}>
                        {
                            getFieldDecorator('contasReceber.formaCondicaoPagamento.id', {})(
                                <Select showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        //onChange={(value) => this.handleChangeForma(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                    {generateOptions(formaCondicaoList.map(({id, formaPagamento, condicaoPagamento }) => ({id, descricao: formaPagamento.nome + ' - ' + condicaoPagamento.nome})))}
                                </Select>
                            )
                        }
                    </Form.Item>               
                </Col>    
                </> }              
            </Row> }
        </Card>      
    </div>)
}

export default TabDados