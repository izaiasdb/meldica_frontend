import React from 'react'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card, Switch, Drawer } from 'antd'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import { obterPercentualDesconto, obterValorDesconto } from '../../../util/moneyUtils'

const Option = Select.Option

export default class DrawerKitProduto extends React.Component {

    constructor(props){
        super(props)

        this.state = { 
            produtoDescricao: null,
            viewStateTab: INSERTING,
            kitProdutoList: []
        }
    }

    UNSAFE_componentWillMount() {
        const { kitProdutoList = []} = this.props
        let dados = []

        kitProdutoList.map((item, i) => {
            dados.push(item);
        })
        
        this.setState({ kitProdutoList: dados });
    } 

    adicionar = () => {
        const { 
            form: { getFieldValue, getFieldsValue, setFieldsValue },
            produtoList = [], codigoPai, ordemServico = {}, setKitProdutoListEvent, 
        } = this.props
        const { viewStateTab, kitProdutoList = [] } = this.state

        let { osKitProduto } = getFieldsValue(['osKitProduto'])
        let { id, produto, quantidadeUnidade, valorUnidade, bonificacao, total, desconto } = osKitProduto      
        
        if(!(produto && produto.id && quantidadeUnidade && valorUnidade) || quantidadeUnidade == 0){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes ao produto.'})
            return null
        }     
        
        let recordInserido = kitProdutoList.find(c=> c.codigoPai == codigoPai && c.produto.id == produto.id && c.bonificacao == bonificacao)

        if ((isEqual(viewStateTab, INSERTING) && recordInserido) || 
            (isEqual(viewStateTab, EDITING) && recordInserido && recordInserido.id != id)) {
            openNotification({tipo: 'warning', descricao: 'Produto já cadastrado.'})
            return null            
        }      

        if (id){
            let oldRegistro = kitProdutoList.find(c=> c.id == id)

            const index = kitProdutoList.indexOf(oldRegistro);

            //Apaga o anterior
            if (index > -1) {
                kitProdutoList.splice(index, 1);
            }          
        }   

        let produtoForm = produtoList.find(c=> c.id == produto.id);
        osKitProduto.nomeProduto = produtoForm.nome;
        osKitProduto.valorProducaoUnidade = produtoForm.valorProducaoUnidade;
        osKitProduto.valorCompraUnidade = produtoForm.valorCompraUnidade;
        osKitProduto.valorVendaUnidade = produtoForm.valorVendaUnidade;
        osKitProduto.cancelado = false;
        osKitProduto.valorNfUnidade = produtoForm.valorNfUnidade;
        osKitProduto.pesoUnidade = produtoForm.pesoUnidade;
        osKitProduto.qtdEstoqueUnidade = produtoForm.qtdEstoqueUnidade;
        osKitProduto.idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id");
        osKitProduto.codigoPai = codigoPai;

        kitProdutoList.push({...osKitProduto})
        setKitProdutoListEvent(kitProdutoList)

        setFieldsValue({ordemServico: { kitProdutoList } }, () => {
            setFieldsValue({
                osKitProduto: { 
                    id: null,
                    codigoPai: codigoPai,
                    produto: { id: null},
                    bonificacao: false, 
                    quantidadeUnidade: 1,
                    valorUnidade: 0,
                    desconto: 0,
                    percDesconto: 0,
                    qtdEstoqueUnidade: 0,
                    total: 0,
                }
            })
        })

        this.setState({ produtoDescricao: null, viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osKitProduto: {...record, } } )
        this.setState({ viewStateTab: EDITING, produtoDescricao: record.produto.nome })
    }    
    
    remover = (record, { getFieldValue, setFieldsValue }) => {
        // const { 
        //     form: { getFieldValue, getFieldsValue, setFieldsValue },
        //     produtoList = [], codigoPai, ordemServico = {}, setKitProdutoListEvent, 
        // } = this.props
        const { kitProdutoList = [] } = this.state
        //let kitProdutoList = getFieldValue("ordemServico.kitProdutoList")

        kitProdutoList.splice(kitProdutoList.findIndex((item) => {            
            return (item.produto && item.produto.id === record.produto.id)
        }), 1)

        setFieldsValue({ordemServico: { kitProdutoList } })
    }

    handleChangeProduto = (idProduto) => {    
        const { form: { getFieldsValue, setFieldsValue, getFieldValue }, produtoList = [], tabelaPrecoProdutoList = [] } = this.props    
        const { osKitProduto } = getFieldsValue() 
        const { percDesconto, quantidadeUnidade, quantidadeCaixa } = osKitProduto 

        this.alterandoValores(idProduto, percDesconto)
    }  

    alterandoValores = (idProduto, percDesconto, quantidadeUnidade) => {
        const { form: { getFieldsValue, setFieldsValue, getFieldValue }, 
            produtoList = [], tabelaPrecoProdutoList = [] 
        } = this.props 
        const { osKitProduto } = getFieldsValue()

        let produto = produtoList.find(c=> c.id == idProduto);
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id") 
        let valorVendaUnidade = produto.valorVendaUnidade

        if (!isNil(idTabelaPreco)){
            let tabelaPrecoProduto = tabelaPrecoProdutoList.find(c=> c.idTabelaPreco == idTabelaPreco && c.produto.id == idProduto);

            if (!isNil(tabelaPrecoProduto)){
                valorVendaUnidade = tabelaPrecoProduto.valorUnidade
            }
        }

        let vValorDesconto = 0;
        let totalProduto = 0;

        vValorDesconto = obterValorDesconto(percDesconto, valorVendaUnidade);
        totalProduto = (valorVendaUnidade - vValorDesconto) * quantidadeUnidade;

        setFieldsValue({osKitProduto: {
                ...osKitProduto, 
                quantidadeUnidade: quantidadeUnidade,
                valorUnidade: valorVendaUnidade,
                desconto: vValorDesconto,
                percDesconto: percDesconto,
                qtdEstoqueUnidade: produto.qtdEstoqueUnidade,
                valorUnidadeComDesconto: valorVendaUnidade - vValorDesconto,
                total: totalProduto,
            } 
        })

        this.setState({produtoDescricao: produto.nome})
    }

    onChangePercDesconto = (percDesconto) => {   
        const { form: { getFieldsValue, setFieldsValue } } = this.props    
        const { osKitProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, quantidadeUnidade, quantidadeCaixa
        } = osKitProduto
       
        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade) 
    }  
    
    onChangeDesconto = (desconto) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [] } = this.props    
        const { osKitProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, quantidadeUnidade, valorUnidade, } = osKitProduto
        
        let percDesconto = 0;

        percDesconto = obterPercentualDesconto(desconto, valorUnidade);

        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade) 
    }   
    
    onChangeQtdUnidade = (quantidadeUnidade) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [], } = this.props    
        const { osKitProduto } = getFieldsValue()     
        const { produto: {id: idProduto}, percDesconto, } = osKitProduto

        this.alterandoValores(idProduto, percDesconto, quantidadeUnidade )     
    } 

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osKitProduto = {
            id: null,
            produto: { id: null},
            bonificacao: false, 
            quantidadeUnidade: 1, 
            valorUnidade: 0,
            desconto: 0,
            percDesconto: 0,
            qtdEstoqueUnidade: 0,
            valorUnidadeComDesconto: 0,
            total: 0,
        }

        this.setState({ viewStateTab: INSERTING })
        setFieldsValue(fields)
    }   

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, form: { getFieldValue }, ordemServico = {}, } = this.props
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")
        
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={() => this.adicionar()}
                    disabled= {isEqual(stateView, VIEWING) || isNil(idTabelaPreco)}>
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
            drawerKitVisivel,
            onCloseDrawerKit,
            idKit,
            codigoPai,
        } = this.props
        const { kitProdutoList = [] } = this.state || {}
        const { getFieldDecorator, getFieldValue } = form

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        let produtoListFilter = produtoList.filter(c=> c.tipo == 'P' || c.tipo == 'C')
        const idForm = getFieldValue("osKitProduto.id") || null  
        //const codigoPaiForm = getFieldValue("osKitProduto.codigoPai") || null  
        const idProdutoForm = getFieldValue("osKitProduto.produto.id") || null 
        const valorUnidadeForm = getFieldValue("osKitProduto.valorUnidade") || 0 
        let produto = null;  
        let percDescontoMaximo = 0;
        let descontoMaximo = 0;
        let kitProdutoFilterList = kitProdutoList.filter(c=> c.codigoPai == codigoPai);
        
        if (idProdutoForm) {        
            produto = produtoList.find(c=> c.id == idProdutoForm);
            percDescontoMaximo = produto.percDescontoMaximo;
            descontoMaximo = obterValorDesconto(percDescontoMaximo, valorUnidadeForm);
        }

        const produtoNome = getFieldValue("osKitProduto.produto.nome") || produtoDescricao
        
        return (<div>
        <Drawer
            title="Kit Produtos"
            //width={720}
            width={"75%"}
            onClose={onCloseDrawerKit}
            visible={drawerKitVisivel}
            bodyStyle={{ paddingBottom: 80 }}
            >
            <Card title={"Informe os produtos referente ao kit"} extra={this.getExtra()}>
                {/* { getFieldDecorator("ordemServico.kitProdutoList", { initialValue: isNil(kitProdutoList) ? [] : kitProdutoList})(<Input type="hidden" />) }              */}
                { getFieldDecorator("osKitProduto.id", { initialValue: idForm })(<Input type="hidden" />) }
                { getFieldDecorator("osKitProduto.codigoPai", { initialValue: codigoPai })(<Input type="hidden" />) }
                { getFieldDecorator("osKitProduto.produto.nome", { initialValue: produtoNome })(<Input type="hidden" />) }     
                <Row gutter = { 12 }>
                    <Col span = { 6 }>
                        <Form.Item label={"Produto"}>
                            {
                                getFieldDecorator('osKitProduto.produto.id', {})(
                                    <Select 
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        onChange={(value) => this.handleChangeProduto(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                        style = {{ width: '98%' }}
                                        >
                                        {generateOptions(produtoListFilter.map(({id, nome}) => ({id, descricao: nome})))}
                                    </Select>
                                )
                            }
                        </Form.Item>               
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Qtd. (unid.)"}>
                            {
                                getFieldDecorator('osKitProduto.quantidadeUnidade', {
                                    initialValue: 1
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }} 
                                        min={0}
                                        precision={0}
                                        step={1} 
                                        onChange={(value) => this.onChangeQtdUnidade(value)}
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Valor(unid.)"}>
                            {
                                getFieldDecorator('osKitProduto.valorUnidade', {
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
                        <Form.Item label={"Estoque(unid.)"}>
                            {
                                getFieldDecorator('osKitProduto.qtdEstoqueUnidade', {
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
                                getFieldDecorator('osKitProduto.percDesconto', {
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
                                getFieldDecorator('osKitProduto.desconto', {
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
                            {getFieldDecorator('osKitProduto.total', {
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
                            getFieldDecorator('osKitProduto.bonificacao', {
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
                    <Form.Item label={"Produtos"}>
                        {
                            // Não deu certo usar o getFieldDecorator
                            <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                                dataSource = {kitProdutoFilterList}
                                pagination={false} bordered>
                                <Table.Column title={<center>Produto</center>} key={"nomeProduto"} dataIndex={"nomeProduto"} align={"center"} />  
                                <Table.Column title={<center>Qtd. unids.</center>} key={"quantidadeUnidade"} dataIndex={"quantidadeUnidade"} align={"center"} />
                                <Table.Column title={<center>Valor(unit)</center>} key={"valorUnidade"} dataIndex={"valorUnidade"} align={"center"} />
                                <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                <Table.Column title={<center>Valor c/ desc.</center>} key={"total2"} dataIndex={"total2"} align={"center"}
                                    render={(text, record) => (record.valorUnidade - record.desconto) } />
                                <Table.Column title={<center>NF unit.</center>} key={"valorNfUnidade"} dataIndex={"valorNfUnidade"} align={"center"} />
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
                        }
                    </Form.Item>
                </Row>
            </Card>
            </Drawer>  
        </div>)
    }
}
