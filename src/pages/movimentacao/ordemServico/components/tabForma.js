import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card } from 'antd'
import { Link } from 'react-router-dom'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import { obterPercentualDesconto, obterValorDesconto } from '../../../util/moneyUtils'

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

        let { osForma } = getFieldsValue(['osForma'])
        let formaItemsList = getFieldValue("ordemServico.formaItemsList")
        let { id, formaCondicaoPagamento, valor, desconto, total, idEmpresa, tipoForma } = osForma      
        
        if(!(formaCondicaoPagamento && formaCondicaoPagamento.id && valor)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes a forma.'})
            return null
        }     

        let recordInserido = formaItemsList
            .find(c=> c.formaCondicaoPagamento.id == formaCondicaoPagamento.id && 
                c.idEmpresa == idEmpresa && c.tipoForma == tipoForma)

        if ((isEqual(viewStateTab, INSERTING) && recordInserido) || 
            (isEqual(viewStateTab, EDITING) && recordInserido && recordInserido.id != id)) {
            openNotification({tipo: 'warning', descricao: 'Forma já cadastrada para esta empresa.'})
            return null            
        }      

        if (id){
            let oldRegistro = formaItemsList.find(c=> c.id == id)

            const index = formaItemsList.indexOf(oldRegistro);

            //Apaga o anterior
            if (index > -1) {
                formaItemsList.splice(index, 1);
            }          
        }   

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == formaCondicaoPagamento.id);
        osForma.nomeFormaPagamento = formaCondicaoForm.formaPagamento.nome;
        osForma.nomeCondicaoPagamento = formaCondicaoForm.condicaoPagamento.nome;
        osForma.cancelado = false;
        osForma.gerado = false;
        osForma.percDescontoFormaCondicao = formaCondicaoForm.percDesconto;
        //osForma.descontoFormaCondicao = obterValorDesconto(formaCondicaoForm.percDesconto, valor - desconto);
               
        formaItemsList.push({...osForma})

        setFieldsValue({ordemServico: { formaItemsList } }, () => {
            setFieldsValue({
                osForma: { id: null,
                    formaCondicaoPagamento: { id: null},
                    idEmpresa: 1,
                    tipoForma: 'P',
                    valor: 0,
                    percDesconto: 0,
                    desconto: 0,
                    percDescontoFormaCondicao: 0,
                    descontoFormaCondicao: 0,
                    total: 0                   
                }
            })
        })

        this.setState({ formaCondicaoDescricao: null, viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osForma: {...record } } )
        this.setState({ 
            viewStateTab: EDITING, 
            formaCondicaoDescricao: record.formaCondicaoPagamento.nome 
        })
    }    
    
    remover = (record, { getFieldValue, setFieldsValue }) => {
        let formaItemsList = getFieldValue("ordemServico.formaItemsList")

        formaItemsList.splice(formaItemsList.findIndex((item) => {            
            return (item.formaCondicaoPagamento && 
                item.formaCondicaoPagamento.id === record.formaCondicaoPagamento.id &&
                item.idEmpresa === record.idEmpresa &&
                item.tipoForma === record.tipoForma
                )
        }), 1)

        setFieldsValue({ordemServico: { formaItemsList } })
    }

    handleChangeForma = (idForma) => {    
        const { form: { getFieldsValue, setFieldsValue }, formaCondicaoList = [], } = this.props    
        const { osForma } = getFieldsValue()       
        const { valor } = osForma 

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == idForma);
        let vValorDesconto = obterValorDesconto(formaCondicaoForm.percDesconto, valor);        
        let descontoFormaCondicao = 0;

        if (formaCondicaoForm && formaCondicaoForm.percDesconto != 0){
            descontoFormaCondicao = obterValorDesconto(formaCondicaoForm.percDesconto, valor - vValorDesconto);
        }
        
        setFieldsValue({osForma: {
                ...osForma,                 
                desconto: vValorDesconto,
                percDesconto: 0,
                percDescontoFormaCondicao: formaCondicaoForm.percDesconto,
                descontoFormaCondicao: descontoFormaCondicao,
                total: valor - vValorDesconto - descontoFormaCondicao,
            } 
        })
        //this.setState({produtoDescricao: produtoForm.nome})
    }     

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osForma = {
            id: null,
            formaCondicaoPagamento: { id: null},
            idEmpresa: 1,
            tipoForma: 'P',            
            valor: 0,
            percDesconto: 0,
            desconto: 0,
            percDescontoFormaCondicao: 0,
            descontoFormaCondicao: 0,
            total: 0
        }

        setFieldsValue(fields)
    }   

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, ordemServico = {}, } = this.props
        const { formaGerada } = ordemServico || {}
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={() => this.adicionar()}
                    disabled= { isEqual(stateView, VIEWING) || formaGerada == true }>
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' } Forma de Pagamento
                </Button>
                &nbsp;
                <Button 
                    type={"primary"} 
                    onClick={this.limpar} 
                    disabled= {isEqual(stateView, VIEWING)}>
                    Limpar
                </Button>
            </>
        )
    }

    onChangePercDesconto = (percDesconto) => {    
        const { form: { getFieldsValue, setFieldsValue }, formaCondicaoList = []} = this.props    
        const { osForma } = getFieldsValue()     
        const { valor, formaCondicaoPagamento } = osForma

        let valorDesconto = obterValorDesconto(percDesconto, valor);
        let descontoFormaCondicao = 0;

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == formaCondicaoPagamento.id);

        if (formaCondicaoForm.percDesconto != 0){
            descontoFormaCondicao = obterValorDesconto(formaCondicaoForm.percDesconto, valor - valorDesconto); 
        }

        setFieldsValue({osForma: {...osForma, 
            desconto: valorDesconto, 
            total: valor - valorDesconto - descontoFormaCondicao,
            descontoFormaCondicao: descontoFormaCondicao
        } })        
    }  
    
    onChangeDesconto = (desconto) => {    
        const { form: { getFieldsValue, setFieldsValue }, formaCondicaoList = []} = this.props    
        const { osForma } = getFieldsValue()     
        const { valor, formaCondicaoPagamento } = osForma
        
        let percDesconto = obterPercentualDesconto(desconto, valor);
        let descontoFormaCondicao = 0;

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == formaCondicaoPagamento.id);

        if (formaCondicaoForm.percDesconto != 0){
            descontoFormaCondicao = obterValorDesconto(formaCondicaoForm.percDesconto, valor - desconto); 
        }

        setFieldsValue({osForma: {...osForma, 
            percDesconto: percDesconto,
            total: valor - desconto - descontoFormaCondicao,
            descontoFormaCondicao: descontoFormaCondicao
        } })        
    } 

    onChangeValor = (valor) => {    
        const { form: { getFieldsValue, setFieldsValue }, formaCondicaoList = [] } = this.props    
        const { osForma } = getFieldsValue()     
        const { desconto, formaCondicaoPagamento } = osForma

        let descontoFormaCondicao = 0;

        let formaCondicaoForm = formaCondicaoList.find(c=> c.id == formaCondicaoPagamento.id);

        if (formaCondicaoForm.percDesconto != 0){
            descontoFormaCondicao = obterValorDesconto(formaCondicaoForm.percDesconto, valor - desconto); 
        }
        
        setFieldsValue({osForma: {...osForma, 
            total: valor - desconto - descontoFormaCondicao,
            descontoFormaCondicao: descontoFormaCondicao
        } })        
    }

    obterTotalFormaInicial = () => {
        const { 
            form,
            ordemServico = {},
        } = this.props
        const { 
            produtoItemsList = [], 
            formaItemsList = [], 
            transportadoraItemsList = [], 
        } = isNil(ordemServico) ? {} : ordemServico        
        const { getFieldDecorator, getFieldValue } = form

        let produtoItemsListForm = getFieldValue("ordemServico.produtoItemsList") || produtoItemsList
        let formaItemsListForm = getFieldValue("ordemServico.formaItemsList") || formaItemsList
        let transportadoraItemsListForm = getFieldValue("ordemServico.transportadoraItemsList") || transportadoraItemsList
        let totalProduto = produtoItemsListForm.filter(c=> c.bonificacao == false).reduce((acum, {total}) => acum + total, 0);
        let totalForma = formaItemsListForm.reduce((acum,{valor, desconto }) => acum + Number(valor), 0);        
        let totalFrete = transportadoraItemsListForm.reduce((acum,{valorFrete}) => acum + Number(valorFrete), 0);
        let totalPedido = (totalProduto ? totalProduto : 0) +  (totalFrete ? totalFrete : 0);
        let faltaFormaPgto = totalPedido - totalForma;

        return faltaFormaPgto
    }

    render() {
        const { viewStateTab, formaCondicaoDescricao } = this.state
        const { 
            form,        
            formaCondicaoList = [],
            empresaList = [],
            ordemServico = {},
            stateView        
        } = this.props
        const { formaItemsList = [] } = ordemServico || {}
        const { getFieldDecorator, getFieldValue } = form
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        let id = getFieldValue("osForma.id") || null    
        // let idForma = getFieldValue("osForma.formaCondicaoPagamento.id") || null
        // let valorForm = getFieldValue("osForma.valor") || null
        // let formaPagamentoForm = null;
        // let valorDesconto = 0;
        // let percentualDesconto = 0;

        // if (idForma && valorForm) {        
        //     formaPagamentoForm = formaCondicaoList.find(c=> c.id == idForma);
        //     percentualDesconto = formaPagamentoForm.percDesconto;
        //     valorDesconto = (formaPagamentoForm.percDesconto * valorForm) / 100;
        // }

        const formaPagamentoNome = getFieldValue("osForma.formaCondicaoPagamento.formaPagamento.nome") || formaCondicaoDescricao
        const condicaoPagamentoNome = getFieldValue("osForma.formaCondicaoPagamento.condicaoPagamento.nome") || formaCondicaoDescricao

        const expandedRowRender = (record, index, indent, expanded) => {
            const { formaCondicaoPagamento } = record
            let dataSourceList = formaCondicaoList.filter(c => c.id == record.formaCondicaoPagamento.id)

            if (!isNil(dataSourceList) && dataSourceList.length > 0) {
                return (
                    <Table dataSource={dataSourceList}
                        rowKey={(row) => row.id}
                        pagination={false}>
                        {/* <Table.Column title={<center>Perc. Desc. Forma Condição</center>} key={"condicaoPagamento.percDesconto"} dataIndex={"condicaoPagamento.percDescontoFormaCondicao"} align={"center"} /> */}
                        <Table.Column title={<center>Quantidade parcelas</center>} key={"condicaoPagamento.qtdParcela"} dataIndex={"condicaoPagamento.qtdParcela"} align={"center"} />
                        {/* diasParcela, prazoDias, entrada */}                
                        <Table.Column title={<center>Valor parcelas</center>} key={"valorParcelas"} dataIndex={"valorParcelas"} align={"center"}
                            render={(text, recordItem) => record.valor / recordItem.condicaoPagamento.qtdParcela} />    
                    
                    </Table>
                )
            } else {
                return (
                    <Table dataSource={[]}
                        pagination={false} />
                )
            }
        };  

        let empresaFilterList = empresaList.filter(c=> c.id != 3);
        
        return (<div>
            <Card title={"Informe os dados referente as formas de pagamento do pedido"} extra={this.getExtra()}>
                { getFieldDecorator("osForma.id", { initialValue: id })(<Input type="hidden" />) }
                { getFieldDecorator("osForma.nomeFormaPagamento", { initialValue: formaPagamentoNome })(<Input type="hidden" />) }        
                { getFieldDecorator("osForma.nomeCondicaoPagamento", { initialValue: condicaoPagamentoNome })(<Input type="hidden" />) }        
                <Row gutter = { 12 }>
                    <Col span = { 6 }>
                        <Form.Item label={"Forma condição de pagamento"}>
                            {
                                getFieldDecorator('osForma.formaCondicaoPagamento.id', {})(
                                    <Select 
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        onChange={(value) => this.handleChangeForma(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        >
                                        {generateOptions(formaCondicaoList.map(({id, formaPagamento, condicaoPagamento }) => ({id, descricao: formaPagamento.nome + ' - ' + condicaoPagamento.nome})))}
                                    </Select>
                                )
                            }
                        </Form.Item>               
                    </Col>
                    <Col span = { 4 }>
                        <Form.Item label={"Empresa"}>
                            {
                                getFieldDecorator('osForma.idEmpresa', {})(
                                    <Select 
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        //onChange={(value) => this.handleChangeForma(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        >
                                        {generateOptions(empresaFilterList)}
                                    </Select>
                                )
                            }
                        </Form.Item>               
                    </Col>                    
                    <Col span={ 2 }>
                        <Form.Item label={"Tipo Forma"}>
                            {
                                getFieldDecorator('osForma.tipoForma', {
                                    //rules: [{required: true, message: 'Por favor, informe o tipo da empresa.'}],
                                    initialValue: 'P'
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        >
                                        <Option key={1} value={null}>{"Selecione"}</Option>
                                        <Option key={2} value={'P'}>{"PRODUTO"}</Option>
                                        <Option key={3} value={'F'}>{"FRETE"}</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Col>                                   
                    <Col span={2}>
                        <Form.Item label={"Valor"}>
                            {
                                getFieldDecorator('osForma.valor', {
                                    initialValue: this.obterTotalFormaInicial() || 0
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        min={0}
                                        precision={2}
                                        step={1}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        onChange={(value) => this.onChangeValor(value)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Perc. desconto"}>
                            {
                                getFieldDecorator('osForma.percDesconto', {
                                    initialValue: 0
                                })(                            
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        //disabled
                                        min={0}
                                        precision={2}
                                        step={1}
                                        //value={percentualDesconto ? percentualDesconto : 0}
                                        onChange={(value) => this.onChangePercDesconto(value)}
                                />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Desconto"}>
                            {
                                getFieldDecorator('osForma.desconto', {
                                    initialValue: 0
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        min={0}
                                        precision={2}
                                        step={1}
                                        disabled
                                        //value={valorDesconto ? valorDesconto : 0}
                                        onChange={(value) => this.onChangeDesconto(value)}
                                        />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Perc. desc. da forma"}>
                            {
                                getFieldDecorator('osForma.percDescontoFormaCondicao', {
                                    initialValue: 0
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        min={0}
                                        precision={2}
                                        step={1}
                                        disabled
                                        />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Desconto da forma"}>
                            {
                                getFieldDecorator('osForma.descontoFormaCondicao', {
                                    initialValue: 0
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        min={0}
                                        precision={2}
                                        step={1}
                                        disabled
                                        />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Total"}>
                            {
                                getFieldDecorator('osForma.total', {
                                    initialValue: 0
                                })(                                
                                <InputNumber 
                                    style={{ width: "150" }}
                                    disabled
                                    min={0}
                                    precision={2}
                                    step={1}
                                    //value={valorForm && valorDesconto ? valorForm - valorDesconto : 0}
                                />)
                            }
                        </Form.Item>
                    </Col> 
                </Row>             
                <Row gutter = { 12 }>
                    <Form.Item label={"Formas de pagamento"}>
                        {
                            getFieldDecorator('ordemServico.formaItemsList', {
                                rules: [{ required: false, type: 'array', message: 'Por favor, informe pelo menos uma forma de pagamento.'}],
                                initialValue: [...formaItemsList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.formaCondicaoPagamento && row.formaCondicaoPagamento.id} size={"small"} 
                                    expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) }
                                    pagination={false} bordered>
                                    <Table.Column title={<center>Forma pagamento</center>} key={"nomeFormaPagamento"} dataIndex={"nomeFormaPagamento"} align={"center"} />
                                    <Table.Column title={<center>Condição pagamento</center>} key={"nomeCondicaoPagamento"} dataIndex={"nomeCondicaoPagamento"} align={"center"} />
                                    <Table.Column title={<center>Empresa</center>} 
                                            key={"idEmpresa"} 
                                            dataIndex={"idEmpresa"} 
                                            align={"center"} 
                                            render={ (text) => empresaList.map(d => { if(d.id == text) return d.nome }) }
                                            />    
                                    <Table.Column title={<center>Tipo Forma</center>} 
                                            key={"tipoForma"} 
                                            dataIndex={"tipoForma"} 
                                            align={"center"} 
                                            render={ (text) => text == "P" ? "PRODUTO" : "FRETE" }
                                            />                                                                              
                                    <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                    <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                    {/* <Table.Column title={<center>Perc. Desc. Forma Condição</center>} key={"percDescontoFormaCondicao"} dataIndex={"percDescontoFormaCondicao"} align={"center"} /> */}
                                    {/* <Table.Column title={<center>Desconto Forma Condição</center>} key={"descontoFormaCondicao"} dataIndex={"descontoFormaCondicao"} align={"center"} /> */}
                                    <Table.Column title={<center>Total c/ desconto</center>} key={"total"} dataIndex={"total"} align={"center"}
                                        render={
                                            (text, record) => (record.valor - record.desconto).toFixed(2)
                                        } />
                                    {/* <Table.Column title={<center>Total a receber</center>} key={"total"} dataIndex={"total"} align={"center"}
                                        render={
                                            (text, record) => record.valor - record.desconto - record.descontoFormaCondicao                                             
                                        } />                                         */}
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record) => {
                                                    return (
                                                        <span>
                                                            {
                                                                !record.id && record.gerado == false && !isEqual(stateView, VIEWING) &&
                                                                <>
                                                                
                                                                <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(record, form) }/>
                                                                <Divider type="vertical"/>
                                                                </>
                                                            }
                                                            {
                                                                record.id && record.gerado == false && !isEqual(stateView, VIEWING) &&
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
            </Card>
        </div>)
    }
}
