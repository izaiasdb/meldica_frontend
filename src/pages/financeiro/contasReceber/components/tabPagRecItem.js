import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import moment from 'moment'

const Option = Select.Option

export default class TabForma extends React.Component {

    state = {
        formaCondicaoDescricao: null,
        viewStateTab: INSERTING,
    }

    adicionar = () => {
        const {
            form: { getFieldValue, getFieldsValue, setFieldsValue },
            formaCondicaoList,
        } = this.props
        const { viewStateTab } = this.state

        let { pagarReceberItem } = getFieldsValue(['pagarReceberItem'])
        let pagarReceber = getFieldValue("contasReceber")
        let pagarReceberItemsList = getFieldValue("contasReceber.pagarReceberItemsList")
        let { id, formaCondicaoPagamento, valor, observacao } = pagarReceberItem

        if(!(formaCondicaoPagamento && formaCondicaoPagamento.id && valor)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes a forma.'})
            return null
        }

        let totalPago = pagarReceberItemsList.reduce((acum,{valor}) => acum + valor, 0);

        // let recordInserido = pagarReceberItemsList.find(c=> c.formaCondicaoPagamento.id == formaCondicaoPagamento.id)

        // if ((isEqual(viewStateTab, INSERTING) && recordInserido) ||
        //     (isEqual(viewStateTab, EDITING) && recordInserido && recordInserido.id != id)) {
        //     openNotification({tipo: 'warning', descricao: 'Forma já cadastrada.'})
        //     return null
        // }

        if (valor + totalPago > (pagarReceber.valor)) {
            openNotification({tipo: 'warning', descricao: 'Valor do pagamento excede o total do documento.'})
            return null
        }

        if (id){
            let oldRegistro = pagarReceberItemsList.find(c=> c.id == id)

            const index = pagarReceberItemsList.indexOf(oldRegistro);

            //Apaga o anterior
            if (index > -1) {
                pagarReceberItemsList.splice(index, 1);
            }
        }

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == formaCondicaoPagamento.id);
        pagarReceberItem.nomeFormaPagamento = formaCondicaoForm.formaPagamento.nome;
        pagarReceberItem.nomeCondicaoPagamento = formaCondicaoForm.condicaoPagamento.nome;
        pagarReceberItem.juros = 0;
        pagarReceberItem.acrescimo = 0;
        pagarReceberItem.desconto = 0;

        pagarReceberItemsList.push({...pagarReceberItem})

        setFieldsValue({contasReceber: { pagarReceberItemsList } }, () => {
            setFieldsValue({
                pagarReceberItem: { id: null,
                    formaCondicaoPagamento: { id: null},
                    valor: 0,
                    juros: 0,
                    acrescimo: 0,
                    desconto: 0,
                    observacao: ''
                }
            })
        })

        this.setState({ formaCondicaoDescricao: null, viewStateTab: INSERTING })
    }

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ pagarReceberItem: {...record } } )
        this.setState({
            viewStateTab: EDITING,
            formaCondicaoDescricao: record.formaCondicaoPagamento.nome
        })
    }

    remover = (record, { getFieldValue, setFieldsValue }) => {
        let pagarReceberItemsList = getFieldValue("contasReceber.pagarReceberItemsList")

        pagarReceberItemsList.splice(pagarReceberItemsList.findIndex((item) => {
            return (item.formaCondicaoPagamento && item.formaCondicaoPagamento.id === record.formaCondicaoPagamento.id)
        }), 1)

        setFieldsValue({contasReceber: { pagarReceberItemsList } })
    }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.pagarReceberItem = {
            formaCondicaoPagamento: { id: null},
            valor: 0,
            juros: 0,
            acrescimo: 0,
            desconto: 0,
            observacao: ''
        }

        setFieldsValue(fields)
    }

    voltar = () => {
    }

    render() {
        const { viewStateTab, formaCondicaoDescricao } = this.state
        const {
            form,
            formaCondicaoList = [],
            clienteList = [],
            contasReceber = {},
            stateView
        } = this.props
        const { pagarReceberItemsList = [] } = contasReceber || {}
        const { getFieldDecorator, getFieldValue } = form

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        let id = getFieldValue("pagarReceberItem.id") || null
        let idForma = getFieldValue("pagarReceberItem.formaCondicaoPagamento.id") || null
        let valorForm = getFieldValue("pagarReceberItem.valor") || null

        const formaPagamentoNome = getFieldValue("pagarReceberItem.formaCondicaoPagamento.formaPagamento.nome") || formaCondicaoDescricao
        const condicaoPagamentoNome = getFieldValue("pagarReceberItem.formaCondicaoPagamento.condicaoPagamento.nome") || formaCondicaoDescricao

        return (<div>
            {/* <Card title={"Recebimentos da Conta"}> */}
                { getFieldDecorator("pagarReceberItem.id", { initialValue: id })(<Input type="hidden" />) }
                { getFieldDecorator("pagarReceberItem.nomeFormaPagamento", { initialValue: formaPagamentoNome })(<Input type="hidden" />) }
                { getFieldDecorator("pagarReceberItem.nomeCondicaoPagamento", { initialValue: condicaoPagamentoNome })(<Input type="hidden" />) }
                <Row gutter={12}>
                    {/* <Col span={ 24 }>
                        <Form.Item label={"Forma condição de pagamento"}>
                            {
                                getFieldDecorator('pagarReceberItem.formaCondicaoPagamento.id', {})(
                                    <Select showSearch
                                            optionFilterProp="children"
                                            //placeholder={"Digite para buscar"}
                                            //onChange={(value) => this.handleChangeForma(value)}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {generateOptions(formaCondicaoList.map(({id, formaPagamento, condicaoPagamento }) => ({id, descricao: formaPagamento.nome + ' - ' + condicaoPagamento.nome})))}
                                    </Select>
                                )

                                // <Select showSearch
                                // optionFilterProp="children"
                                // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                // >
                                // <Option key={1} value={null}>{"Selecione"}</Option>
                                // {generateOptions(clienteList)}
                        // </Select>
                            }
                        </Form.Item>
                    </Col> */}
                    <Col span={ 24 }>
                        <Form.Item label={"Forma condição de pagamento"}>
                            {
                                getFieldDecorator('pagarReceberItem.formaCondicaoPagamento.id', {
                                    rules: [{required: false, message: 'Por favor, informe o cliente.'}],
                                    initialValue: null//isNil(cliente) ? null : cliente.id
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        width= "100%"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        {/* {generateOptions(clienteList)} */}
                                        {generateOptions(formaCondicaoList.map(({id, formaPagamento, condicaoPagamento }) => ({id, descricao: formaPagamento.nome + ' - ' + condicaoPagamento.nome})))}
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter = { 12 }>
                    <Col span={ 8 }>
                        <Form.Item label={"Data do Vencimento"}>
                            {
                                getFieldDecorator('pagarReceberItem.dataPagamento', {
                                    rules: [{required: true, message: "Por favor, informe a data da venda."}
                                    //{ validator: validateDataContasReceber}
                                ], //initialValue: isNil(dataVencimento) ? moment() : new moment(dataVencimento)
                                    initialValue: new moment()
                                })(
                                    <DatePicker style = {{ width: '98%' }}
                                                disabled= {isEqual(stateView, VIEWING)}
                                                format={'DD/MM/YYYY'}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label={"Valor"}>
                            {
                                getFieldDecorator('pagarReceberItem.valor', {
                                    initialValue: 0
                                })(
                                    <InputNumber style={{ width: "150" }}
                                        disabled= {isEqual(stateView, VIEWING)}
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
                    <Col span={ 24 }>
                        <Form.Item label={"Observação"} >
                            {
                                getFieldDecorator('pagarReceberItem.observacoes', {
                                    rules: [{ required: false, message: "Por favor, informe a observação."}],
                                })(<Input.TextArea 
                                        disabled= {isEqual(stateView, VIEWING)}
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                        onInput={toInputUppercase}
                                />)
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter = { 12 }>
                    <Col span={ 6 }>
                        <Form.Item label={<span style={{height: '3px'}} />}>
                            {
                                <Button type={"primary"} 
                                    onClick={() => this.adicionar(form)}
                                    disabled= {isEqual(stateView, VIEWING)}>
                                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' } Recebimento
                                </Button>
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={<span style={{height: '3px'}} />}>
                            {
                                <Button type={"primary"} onClick={this.limpar}
                                    disabled= {isEqual(stateView, VIEWING)}>
                                    Limpar
                                </Button>
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 4 }>
                        <Form.Item label={<span style={{height: '3px'}} />}>
                            {
                                <Button type={"primary"} onClick={this.voltar} >
                                    Voltar
                                </Button>
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter = { 12 }>
                    <Form.Item label={"Formas de pagamento"}>
                        {
                            getFieldDecorator('contasReceber.pagarReceberItemsList', {
                                rules: [{ required: false, type: 'array', message: 'Por favor, informe pelo menos uma forma de pagamento.'}],
                                initialValue: [...pagarReceberItemsList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.formaCondicaoPagamento && row.formaCondicaoPagamento.id} size={"small"}
                                    pagination={false} bordered>
                                    <Table.Column key={'dataPagamento'}
                                        dataIndex={'dataPagamento'}
                                        title={'Data do Recebimento'}
                                        align={ "center" }
                                        render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                        width={'10%'}/>
                                    <Table.Column title={<center>Forma pagamento</center>} 
                                        key={"nomeFormaPagamento"} 
                                        dataIndex={"nomeFormaPagamento"} align={"center"} 
                                        render= {(text, record) => 
                                            !isNil(record.formaCondicaoPagamento.formaPagamento) ? 
                                                record.formaCondicaoPagamento.formaPagamento.nome : text
                                        } />
                                    <Table.Column title={<center>Condição pagamento</center>} 
                                        key={"nomeCondicaoPagamento"} 
                                        dataIndex={"nomeCondicaoPagamento"} 
                                        align={"center"}
                                        render= {(text, record) => 
                                            !isNil(record.formaCondicaoPagamento.condicaoPagamento) ? 
                                            record.formaCondicaoPagamento.condicaoPagamento.nome : text
                                        } />
                                    <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                    <Table.Column title={<center>Ações</center>} key={"actions"}
                                                dataIndex={"actions"}
                                                align={"center"}
                                                render={ (text, record) => {
                                                    return (
                                                        <span>
                                                            {
                                                                !isEqual(stateView, VIEWING) &&
                                                                <> 
                                                                <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(record, form) }/>
                                                                <Divider type="vertical"/>
                                                                </>
                                                            }
                                                            {
                                                                record.id && !isEqual(stateView, VIEWING) &&
                                                                <>
                                                                    <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon>
                                                                </>
                                                            }
                                                        </span>
                                                    )}
                                                }/>
                                </Table>
                            )
                        }
                    </Form.Item>
                </Row>
            {/* </Card> */}
        </div>)
    }
}
