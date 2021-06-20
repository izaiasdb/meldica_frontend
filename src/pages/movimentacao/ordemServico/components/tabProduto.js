import React from 'react'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card, Switch } from 'antd'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import { obterPercentualDesconto, obterValorDesconto } from '../../../util/moneyUtils'

const Option = Select.Option

export default class TabProduto extends React.Component {

    state = { 
        produtoDescricao: null,
        viewStateTab: INSERTING,
    }

    adicionar = () => {
        const { 
            form: { getFieldValue, getFieldsValue, setFieldsValue },
            produtoList = [], 
        } = this.props
        const { viewStateTab } = this.state

        let { osProduto } = getFieldsValue(['osProduto'])
        let produtoItemsList = getFieldValue("ordemServico.produtoItemsList")
        let { id, produto, quantidadeUnidade, valorUnidade, bonificacao, quantidadeCaixa, valorCaixa, total, fracionado, desconto } = osProduto      
        
        if (fracionado) {
            if(!(produto && produto.id && quantidadeUnidade && valorUnidade) || quantidadeUnidade == 0){
                openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes ao produto.'})
                return null
            }     
        } else {
            if(!(produto && produto.id && quantidadeCaixa, valorCaixa) || quantidadeCaixa == 0){
                openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes ao produto.'})
                return null
            } 
        }

        let recordInserido = produtoItemsList.find(c=> c.produto.id == produto.id && c.bonificacao == bonificacao)

        if ((isEqual(viewStateTab, INSERTING) && recordInserido) || 
            (isEqual(viewStateTab, EDITING) && recordInserido && recordInserido.id != id)) {
            openNotification({tipo: 'warning', descricao: 'Produto já cadastrado.'})
            return null            
        }      

        if (id){
            let oldRegistro = produtoItemsList.find(c=> c.id == id)

            const index = produtoItemsList.indexOf(oldRegistro);

            //Apaga o anterior
            if (index > -1) {
                produtoItemsList.splice(index, 1);
            }          
        }   

        let produtoForm = produtoList.find(c=> c.id == produto.id);
        osProduto.nomeProduto = produtoForm.nome;
        osProduto.valorProducaoUnidade = produtoForm.valorProducaoUnidade;
        osProduto.valorProducaoCaixa = produtoForm.valorProducaoCaixa;
        osProduto.valorCompraUnidade = produtoForm.valorCompraUnidade;
        osProduto.valorCompraCaixa = produtoForm.valorCompraCaixa;
        osProduto.valorVendaUnidade = produtoForm.valorVendaUnidade;
        osProduto.valorVendaCaixa = produtoForm.valorVendaCaixa;        
        osProduto.cancelado = false;
        osProduto.valorNfUnidade = produtoForm.valorNfUnidade;
        osProduto.valorNfCaixa = produtoForm.valorNfCaixa;
        osProduto.pesoUnidade = produtoForm.pesoUnidade;
        osProduto.pesoCaixa = produtoForm.pesoCaixa;
        osProduto.qtdEstoqueCaixa = produtoForm.qtdEstoqueCaixa;
        osProduto.qtdEstoqueUnidade = produtoForm.qtdEstoqueUnidade;
        osProduto.quantidadeNaCaixa = produtoForm.quantidadeCaixa;
        osProduto.idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id");
        osProduto.idEmpresaProduto = produtoForm.empresa.id;

        if (produtoForm.fracionado) {
            osProduto.valorCaixa = 0;
            osProduto.quantidadeCaixa = quantidadeUnidade / produtoForm.quantidadeCaixa;
        } else {
            osProduto.valorUnidade = 0;
            osProduto.quantidadeUnidade = quantidadeCaixa * produtoForm.quantidadeCaixa;
        }
               
        produtoItemsList.push({...osProduto})

        setFieldsValue({ordemServico: { produtoItemsList } }, () => {
            setFieldsValue({
                osProduto: { 
                    id: null,
                    produto: { id: null },
                    bonificacao: false, 
                    quantidadeUnidade: 1,
                    quantidadeCaixa: 1, 
                    valorUnidade: 0,
                    valorCaixa: 0,
                    desconto: 0,
                    percDesconto: 0,
                    qtdEstoqueCaixa: 0,
                    qtdEstoqueUnidade: 0,
                    fracionado: false,
                    valorCaixaDesconto: 0,
                    total: 0,
                }
            })
        })

        this.setState({ produtoDescricao: null, viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osProduto: {...record, 
        } } )
        this.setState({ viewStateTab: EDITING, produtoDescricao: record.produto.nome })
    }    
    
    remover = (record, { getFieldValue, setFieldsValue }) => {
        let produtoItemsList = getFieldValue("ordemServico.produtoItemsList")

        produtoItemsList.splice(produtoItemsList.findIndex((item) => {            
            return (item.produto && item.produto.id === record.produto.id)
        }), 1)

        setFieldsValue({ordemServico: { produtoItemsList } })
    }

    handleChangeProduto = (idProduto) => {    
        const { form: { getFieldsValue, setFieldsValue, getFieldValue }, produtoList = [], tabelaPrecoProdutoList = [] } = this.props    
        const { osProduto } = getFieldsValue() 
        const { percDesconto, quantidadeUnidade, quantidadeCaixa } = osProduto 

        this.alterandoValores(idProduto, percDesconto)
    }  

    alterandoValores = (idProduto, percDesconto, quantidadeUnidade, quantidadeCaixa) => {
        const { form: { getFieldsValue, setFieldsValue, getFieldValue }, 
            produtoList = [], tabelaPrecoProdutoList = [] 
        } = this.props 
        const { osProduto } = getFieldsValue()

        let produto = produtoList.find(c=> c.id == idProduto);
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id") 
        let fracionado = produto.fracionado
        let valorVendaUnidade = produto.valorVendaUnidade
        let valorVendaCaixa = produto.valorVendaCaixa   

        if (!isNil(idTabelaPreco)){
            let tabelaPrecoProduto = tabelaPrecoProdutoList.find(c=> c.idTabelaPreco == idTabelaPreco && c.produto.id == idProduto);

            if (!isNil(tabelaPrecoProduto)){
                if (tabelaPrecoProduto.valorUnidade) {
                    valorVendaUnidade = tabelaPrecoProduto.valorUnidade
                }

                if (tabelaPrecoProduto.valorCaixa) {
                    valorVendaCaixa = tabelaPrecoProduto.valorCaixa
                }
            }
        }

        let vValorDesconto = 0;
        let totalProduto = 0;

        if (fracionado) {
            vValorDesconto = obterValorDesconto(percDesconto, valorVendaUnidade);
            totalProduto = (valorVendaUnidade - vValorDesconto) * (isNil(quantidadeUnidade) ? produto.quantidadeCaixa : quantidadeUnidade);
        } else {
            vValorDesconto = obterValorDesconto(percDesconto, valorVendaCaixa);
            totalProduto = (valorVendaCaixa - vValorDesconto) * (isNil(quantidadeCaixa) ? 1: quantidadeCaixa); 
        }

        setFieldsValue({osProduto: {
                ...osProduto, 
                quantidadeUnidade: isNil(quantidadeUnidade) ? produto.quantidadeCaixa : quantidadeUnidade,
                quantidadeCaixa: isNil(quantidadeCaixa) ? 1 : quantidadeCaixa,
                valorUnidade: valorVendaUnidade,
                valorCaixa: valorVendaCaixa,
                desconto: vValorDesconto,
                percDesconto: percDesconto,
                qtdEstoqueCaixa: produto.qtdEstoqueCaixa,
                qtdEstoqueUnidade: produto.qtdEstoqueUnidade,
                fracionado: fracionado,
                valorCaixaDesconto: valorVendaCaixa - vValorDesconto,
                total: totalProduto,
            } 
        })

        this.setState({produtoDescricao: produto.nome})
    }

    getTotal = (idProduto, quantidadeUnidade, quantidadeCaixa, desconto, fracionado, valorVendaUnidade, valorVendaCaixa) => {
        const { form: { getFieldsValue, }, produtoList = [], tabelaPrecoProdutoList = [] } = this.props
        const { osProduto } = getFieldsValue() 

        let produto = produtoList.find(c=> c.id == idProduto);
        let tabelaPrecoProduto = null;
        let totalProduto = 0;

        if (produto.fracionado) {
            totalProduto = (produto.valorVendaUnidade - desconto) * quantidadeUnidade;
        } else {
            totalProduto = (produto.valorVendaCaixa - desconto) * quantidadeCaixa; 
        }

        return totalProduto;
    }
    
    onChangePercDesconto = (percDesconto) => {   
        const { form: { getFieldsValue, setFieldsValue } } = this.props    
        const { osProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, quantidadeUnidade, quantidadeCaixa
        } = osProduto
       
        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade, quantidadeCaixa) 
    }  
    
    onChangeDesconto = (desconto) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [] } = this.props    
        const { osProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, quantidadeUnidade, quantidadeCaixa, valorUnidade, valorCaixa, fracionado } = osProduto
        
        let percDesconto = 0;

        if (fracionado) {
            percDesconto = obterPercentualDesconto(desconto, valorUnidade);
        } else {
            percDesconto = obterPercentualDesconto(desconto, valorCaixa);
        }

        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade, quantidadeCaixa) 
    }   
    
    onChangeQtdCaixa = (qtdCaixa) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [], } = this.props    
        const { osProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, quantidadeCaixa, quantidadeUnidade, desconto, percDesconto } = osProduto

        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade, qtdCaixa)
    }

    onChangeQtdUnidade = (quantidadeUnidade) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [], } = this.props    
        const { osProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, percDesconto, quantidadeCaixa} = osProduto

        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade, quantidadeCaixa)     
    } 

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osProduto = {
            id: null,
            produto: { id: null},
            bonificacao: false, 
            quantidadeUnidade: 1, 
            quantidadeCaixa: 1, 
            valorUnidade: 0,
            valorCaixa: 0,
            desconto: 0,
            percDesconto: 0,
            qtdEstoqueCaixa: 0,
            qtdEstoqueUnidade: 0,
            fracionado: false,
            valorCaixaDesconto: 0,
            total: 0,
        }

        this.setState({ viewStateTab: INSERTING })
        setFieldsValue(fields)
    }   

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, form: { getFieldValue }, ordemServico = {}, } = this.props
        const { estoqueGerado } = ordemServico || {}        
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")
        
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={() => this.adicionar()}
                    disabled= {isEqual(stateView, VIEWING) || isNil(idTabelaPreco) || estoqueGerado == true }>
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' } Produto
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

    render() {
        const { viewStateTab, produtoDescricao } = this.state
        const { 
            form,        
            produtoList = [],
            ordemServico = {},      
            stateView,  
        } = this.props
        const { produtoItemsList = [] } = ordemServico || {}
        const { getFieldDecorator, getFieldValue } = form

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        let produtoListFilter = produtoList.filter(c=> c.tipo == 'P' || c.tipo == 'C')
        const idForm = getFieldValue("osProduto.id") || null  
        const idProdutoForm = getFieldValue("osProduto.produto.id") || null 
        const valorCaixaForm = getFieldValue("osProduto.valorCaixa") || 0 
        const valorUnidadeForm = getFieldValue("osProduto.valorUnidade") || 0 
        let idEmpresaProduto = getFieldValue("osProduto.idEmpresaProduto") || 0
        let fracionado = false; 
        let produto = null;  
        let percDescontoMaximo = 0;
        let descontoMaximo = 0;
        
        if (idProdutoForm) {        
            produto = produtoList.find(c=> c.id == idProdutoForm);
            fracionado = produto.fracionado;
            percDescontoMaximo = produto.percDescontoMaximo;
            idEmpresaProduto = produto.empresa.id;

            if (fracionado){
                descontoMaximo = obterValorDesconto(percDescontoMaximo, valorUnidadeForm);
            } else {
                descontoMaximo = obterValorDesconto(percDescontoMaximo, valorCaixaForm);
            }
        }

        const produtoNome = getFieldValue("osProduto.produto.nome") || produtoDescricao
        
        return (<div>
            <Card title={"Informe os dados referente aos produtos da Ordem de Serviço"} extra={this.getExtra()}>
                { getFieldDecorator("osProduto.id", { initialValue: idForm })(<Input type="hidden" />) }
                { getFieldDecorator("osProduto.produto.nome", { initialValue: produtoNome })(<Input type="hidden" />) }     
                { getFieldDecorator("osProduto.idEmpresaProduto", { initialValue: idEmpresaProduto })(<Input type="hidden" />) } 
                { getFieldDecorator("osProduto.fracionado", { initialValue: fracionado })(<Input type="hidden" />) } 
                <Row gutter = { 12 }>
                    <Col span = { 6 }>
                        <Form.Item label={"Produto"}>
                            {
                                getFieldDecorator('osProduto.produto.id', {})(
                                    <Select 
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        onChange={(value) => this.handleChangeProduto(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        >
                                        {generateOptions(produtoListFilter.map(({id, nome}) => ({id, descricao: nome})))}
                                    </Select>
                                )
                            }
                        </Form.Item>               
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Qtd. caixas"}>
                            {
                                getFieldDecorator('osProduto.quantidadeCaixa', {
                                    initialValue: 1
                                })(
                                    <InputNumber style={{ width: "150" }} 
                                        min={0}
                                        precision={0}
                                        step={1}  
                                        onChange={(value) => this.onChangeQtdCaixa(value)} 
                                        //disabled= {isEqual(stateView, VIEWING)}
                                        disabled= {isEqual(stateView, VIEWING) || fracionado == true}
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Valor(cx)"}>
                            {
                                getFieldDecorator('osProduto.valorCaixa', {
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
                        <Form.Item label={"Estoque(caixa)"}>
                            {
                                getFieldDecorator('osProduto.qtdEstoqueCaixa', {
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
                    <Col span={3}>
                        <Form.Item label={"Perc. desc." + "(máx "+(percDescontoMaximo ? percDescontoMaximo : 0) +")"}>
                            {
                                getFieldDecorator('osProduto.percDesconto', {
                                    initialValue: 0
                                })(                            
                                    <InputNumber style={{ width: "150" }}                                
                                        min={0}
                                        precision={2}
                                        step={1}
                                        max={percDescontoMaximo} //5
                                        onChange={(value) => this.onChangePercDesconto(value)}                                
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={3}>
                        <Form.Item label={"Desc." + "(máx "+(descontoMaximo ? descontoMaximo : 0 )+")"}>
                            {
                                getFieldDecorator('osProduto.desconto', {
                                    initialValue: 0
                                })(
                                    <InputNumber style={{ width: "150" }}
                                    min={0}
                                    precision={2}
                                    step={1}
                                    max={descontoMaximo}
                                    //disabled
                                    onChange={(value) => this.onChangeDesconto(value)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label={"Total(c/ Descont.)"}>
                            {getFieldDecorator('osProduto.total', {
                                initialValue: 0
                            })(                                      
                                <InputNumber style={{ width: "150" }}
                                    disabled
                                    min={0}
                                    precision={2}
                                    step={1}
                                />
                            )}
                        </Form.Item>
                    </Col>  
                    <Col span={ 2 }>            
                        <Form.Item label={"Bonificação"}>
                        {
                            getFieldDecorator('osProduto.bonificacao', {
                                initialValue: false,
                                valuePropName: 'checked'                                    
                            })(
                                <Switch 
                                    checkedChildren="SIM" 
                                    unCheckedChildren="NÃO"
                                    disabled= {isEqual(stateView, VIEWING)}/>
                            )
                        }
                        </Form.Item>
                    </Col>                        
                </Row>  
                <Row gutter = { 12 }>
                    <Col span = { 6 }>
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Qtd. (unds.)"}>
                            {
                                getFieldDecorator('osProduto.quantidadeUnidade', {
                                    initialValue: 1
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }} 
                                        min={0}
                                        precision={0}
                                        step={1} 
                                        onChange={(value) => this.onChangeQtdUnidade(value)}
                                        disabled= {isEqual(stateView, VIEWING) || fracionado == false}
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Valor(unidade)"}>
                            {
                                getFieldDecorator('osProduto.valorUnidade', {
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
                        <Form.Item label={"Estoque(unidade)"}>
                            {
                                getFieldDecorator('osProduto.qtdEstoqueUnidade', {
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
                </Row>       
                <Row gutter = { 12 }>
                    <Form.Item 
                        //label={"Produtos"}
                        >
                        {
                            getFieldDecorator('ordemServico.produtoItemsList', {
                                rules: [{ required: false, type: 'array', message: 'Por favor, informe pelo menos um produto.'}],
                                initialValue: [...produtoItemsList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                                    pagination={false} bordered
                                    title={() => <span>PRODUTOS</span>}
                                    footer={() => 
                                        <Row>
                                            <Col span={4}>
                                               {"Total qtd. caixas:" + produtoItemsList.reduce((acum, {quantidadeCaixa}) => acum + Number(quantidadeCaixa), 0) }
                                            </Col>
                                            <Col span={4}>
                                               {"Total vl. caixa:" + produtoItemsList.reduce((acum, {valorCaixa}) => acum + Number(valorCaixa), 0) }
                                            </Col>
                                            <Col span={4}>
                                               {"Total desconto:" + produtoItemsList.reduce((acum, {desconto}) => acum + Number(desconto), 0) }
                                            </Col>        
                                            <Col span={4}>
                                               {"Total valor c/ desc.:" + produtoItemsList.reduce((acum, {valorCaixa, desconto}) => acum + ( Number(valorCaixa) - Number(desconto)), 0) }
                                            </Col>                                                                                      
                                            <Col span={4}>
                                               {"Total NF caixa:" + produtoItemsList.reduce((acum, {valorNfCaixa}) => acum + Number(valorNfCaixa), 0) }
                                            </Col>                                            
                                            <Col span={4}>
                                               {'Total produto(c/ desc):' + produtoItemsList.reduce((acum, {total}) => acum + Number(total), 0) }
                                            </Col>
                                        </Row>
                                    }>
                                    <Table.Column title={<center>Produto</center>} key={"nomeProduto"} dataIndex={"nomeProduto"} align={"center"} />  
                                    <Table.Column title={<center>Qtd. cx's</center>} key={"quantidadeCaixa"} dataIndex={"quantidadeCaixa"} align={"center"} />    
                                    <Table.Column title={<center>Qtd. unids.</center>} key={"quantidadeUnidade"} dataIndex={"quantidadeUnidade"} align={"center"} />
                                    <Table.Column title={<center>Valor(unit)</center>} key={"valorUnidade"} dataIndex={"valorUnidade"} align={"center"} />
                                    <Table.Column title={<center>Valor(cx)</center>} key={"valorCaixa"} dataIndex={"valorCaixa"} align={"center"} />
                                    <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                    <Table.Column title={<center>Valor c/ desc.</center>} key={"total2"} dataIndex={"total2"} align={"center"}
                                        render={(text, record) => record.fracionado ?
                                             (record.valorUnidade - record.desconto) : 
                                             (record.valorCaixa - record.desconto)  } />
                                    <Table.Column title={<center>NF unit.</center>} key={"valorNfUnidade"} dataIndex={"valorNfUnidade"} align={"center"} />
                                    <Table.Column title={<center>NF cx</center>} key={"valorNfCaixa"} dataIndex={"valorNfCaixa"} align={"center"} />
                                    <Table.Column title={<center>Total(C/ Desc.)</center>} key={"total"} dataIndex={"total"} align={"center"} />
                                    <Table.Column title={<center>Bonif.</center>} key={"bonificacao"} dataIndex={"bonificacao"} align={"center"}
                                        render={(text, record) => record.bonificacao ? 'SIM' : 'NÃO'} />    
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record) => {
                                                    return (
                                                        <span>
                                                            {
                                                                // !record.id &&
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
            </Card>
        </div>)
    }
}
