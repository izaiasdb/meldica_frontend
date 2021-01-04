import React from 'react'
import { connect } from 'react-redux'
//import VisitanteActions from '../redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card, Switch } from 'antd'
import { Link } from 'react-router-dom'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
//import { hasAnyAuthority } from '../../../../services/authenticationService'
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
        let { id, produto, quantidade, valor, qtdCaixaCalc, bonificacao, quantidadeCaixa } = osProduto      
        
        if(!(produto && produto.id && quantidade && valor && qtdCaixaCalc)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes ao produto.'})
            return null
        }     

        let recordInserido = produtoItemsList.find(c=> c.produto.id == produto.id)

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
        osProduto.valorProducao = produtoForm.valorProducao;
        osProduto.valorCompra = produtoForm.valorCompra;
        osProduto.valorVenda = produtoForm.valorVenda;        
        //osProduto.desconto = 0;
        osProduto.cancelado = false;
        osProduto.valorNf = produtoForm.valorNf;
        osProduto.quantidadeCaixa = produtoForm.quantidadeCaixa;
        osProduto.peso = produtoForm.peso;
        osProduto.quantidade = qtdCaixaCalc * produtoForm.quantidadeCaixa;

        // if (this.state.produtoDescricao && this.state.produtoDescricao != ''){
        //     produto.nome = this.state.produtoDescricao              
        // }        
               
        produtoItemsList.push({...osProduto})

        setFieldsValue({ordemServico: { produtoItemsList } }, () => {
            setFieldsValue({
                osProduto: { id: null,
                    produto: { id: null},
                    bonificacao: false, 
                    quantidade: 0,
                    qtdCaixaCalc: 1, 
                    valor: 0 
                }
            })
        })

        this.setState({ produtoDescricao: null, viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osProduto: {...record, qtdCaixaCalc: record.quantidade /record.quantidadeCaixa } } )
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
        let produtoForm = produtoList.find(c=> c.id == idProduto);
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")    
        let valorVenda = produtoForm.valorVenda
        const { percDesconto } = osProduto 

        if (!isNil(idTabelaPreco)){
            let tabelaPrecoProduto = tabelaPrecoProdutoList.find(c=> c.idTabelaPreco == idTabelaPreco && c.produto.id == idProduto);

            if (!isNil(tabelaPrecoProduto)){
                valorVenda = tabelaPrecoProduto.valor
            }
        }

        let vValorDesconto = obterValorDesconto(percDesconto, valorVenda);
        let vPercDesconto = obterPercentualDesconto(vValorDesconto, valorVenda);

        setFieldsValue({osProduto: {
                ...osProduto, 
                valor: valorVenda,
                desconto: vValorDesconto,
                percDesconto: vPercDesconto,
                quantidade: produtoForm.quantidadeCaixa,
            } 
        })
        this.setState({produtoDescricao: produtoForm.nome})
    }  
    
    onChangePercDesconto = (percDesconto) => {    
        const { form: { getFieldsValue, setFieldsValue } } = this.props    
        const { osProduto } = getFieldsValue()     
        const { valor } = osProduto
                
        //let valorDesconto = (percDesconto * valor) / 100;
        let valorDesconto = obterValorDesconto(percDesconto, valor);

        setFieldsValue({osProduto: {...osProduto, desconto: valorDesconto} })        
    }  
    
    onChangeDesconto = (desconto) => {    
        const { form: { getFieldsValue, setFieldsValue } } = this.props    
        const { osProduto } = getFieldsValue()     
        const { valor } = osProduto
        
        //let percDesconto = ((desconto / valor) * 100);
        let percDesconto = obterPercentualDesconto(desconto, valor);

        setFieldsValue({osProduto: {...osProduto, percDesconto: percDesconto} })        
    }   
    
    onChangeQtdCaixa = (qtdCaixa) => {    
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [], } = this.props    
        const { osProduto } = getFieldsValue()     
        //const { quantidadeCaixa } = osProduto

        let produtoForm = produtoList.find(c=> c.id == osProduto.produto.id);
        //osProduto.nomeProduto = produtoForm.quantidadeCaixa;
                
        setFieldsValue({osProduto: {...osProduto, quantidade: qtdCaixa * produtoForm.quantidadeCaixa} })        
    } 

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osProduto = {
            produto: { id: null},
            bonificacao: false, 
            quantidade: 0, 
            qtdCaixaCalc: 1,
            valor: 0 
        }

        setFieldsValue(fields)
    }   

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, form: { getFieldValue } } = this.props
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")
        
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={() => this.adicionar()}
                    disabled= {isEqual(stateView, VIEWING) || isNil(idTabelaPreco) }>
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

        const id = getFieldValue("osProduto.id") || null    
        const idProduto = getFieldValue("osProduto.produto.id") || null
        const quantidade = getFieldValue("osProduto.quantidade") || null
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id") || null
        let produtoListFilter = produtoList.filter(c=> c.tipo == 'P' || c.tipo == 'C')
        let totalProduto = 0;
        let produtoForm = null;  
        let percDescontoMaximo = 0;      
        let quantidadeCaixa = 0;     

        if (idProduto && quantidade) {        
            produtoForm = produtoList.find(c=> c.id == idProduto);
            totalProduto = produtoForm.valorVenda * quantidade;
            percDescontoMaximo = produtoForm.percDescontoMaximo;
            quantidadeCaixa = produtoForm.quantidadeCaixa;
        }

        const produtoNome = getFieldValue("osProduto.produto.nome") || produtoDescricao
        
        return (<div>
            <Card title={"Informe os dados referente aos produtos da Ordem de Serviço"} extra={this.getExtra()}>
                { getFieldDecorator("osProduto.id", { initialValue: id })(<Input type="hidden" />) }
                { getFieldDecorator("osProduto.produto.nome", { initialValue: produtoNome })(<Input type="hidden" />) }     
                { getFieldDecorator("osProduto.quantidadeCaixa", { initialValue: quantidadeCaixa })(<Input type="hidden" />) }    
                {/* { getFieldDecorator("osProduto.id", { initialValue: id })(<Input type="hidden" />) } */}        
                {/* { isEqual(viewStateTab, EDITING) && getFieldDecorator("relacao.pessoaRelacao.id", { initialValue: id })(<Input type="hidden" />) } */}
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
                                getFieldDecorator('osProduto.qtdCaixaCalc', {
                                    initialValue: 1
                                })(
                                    <InputNumber style={{ width: "150" }} 
                                        min={0}
                                        precision={0}
                                        step={1}  
                                        onChange={(value) => this.onChangeQtdCaixa(value)} 
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col>                     
                    <Col span={2}>
                        <Form.Item label={"Qtd. (unds)"}>
                            {
                                getFieldDecorator('osProduto.quantidade', {
                                    initialValue: 1
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }} 
                                        disabled
                                        min={0}
                                        precision={0}
                                        step={1} 
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col>                   
                    <Col span={2}>
                        <Form.Item label={"Perc. desconto"}>
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
                                        //value={percentualDesconto ? percentualDesconto : 0}
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col> 
                    <Col span={2}>
                        <Form.Item label={"Desconto"}>
                            {
                                getFieldDecorator('osProduto.desconto', {
                                    initialValue: 0
                                })(
                                    <InputNumber style={{ width: "150" }}
                                    min={0}
                                    precision={2}
                                    step={1}
                                    disabled
                                    onChange={(value) => this.onChangeDesconto(value)}                                    
                                    />
                                )
                            }
                        </Form.Item>
                    </Col>                                
                    <Col span={2}>
                        <Form.Item label={"Valor(unitário)"}>
                            {
                                getFieldDecorator('osProduto.valor', {
                                    initialValue: 0
                                })(
                                    <InputNumber 
                                        style={{ width: "150" }}
                                        min={0}
                                        precision={2}
                                        step={1}
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col>                              
                    <Col span={3}>
                        <Form.Item label={"Total"}>
                            {
                                <InputNumber style={{ width: "150" }}
                                    disabled
                                    min={0}
                                    precision={2}
                                    step={1}
                                    value={totalProduto ? totalProduto : 0}
                                />
                            }
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
                {/* <Row gutter = { 12 }>
                    <Col span={ 3 }>
                        <Form.Item label={<span style={{height: '3px'}} />}>
                            {
                                <Button type={"primary"} 
                                    onClick={() => this.adicionar(form)}
                                    disabled= {isEqual(stateView, VIEWING) || isNil(idTabelaPreco) }>
                                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' } Produto
                                </Button>
                            }
                        </Form.Item>
                    </Col>
                    <Col span={ 3 }>
                        <Form.Item label={<span style={{height: '3px'}} />}>
                            {
                                <Button type={"primary"} 
                                        onClick={this.limpar} 
                                        disabled= {isEqual(stateView, VIEWING)}>
                                    Limpar
                                </Button>
                            }
                        </Form.Item>
                    </Col>
                </Row> */}
                {/* <Row gutter={12}>
                    <Col span={ 24 }>
                        <Form.Item label={"Observação"} >
                            {
                                getFieldDecorator('relacao.observacoes', {
                                    rules: [{ required: false, message: "Por favor, informe a observação."}],
                                    //initialValue: descricao
                                })(<Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }}
                                    onInput={toInputUppercase} 
                                    //disabled = { isEqual(viewStateTab, INSERTING) && autorizacaoCustodiadoForm != 'S' && autorizacaoUnidadeForm != 'S' } 
                                />)
                            }                                
                        </Form.Item>                            
                    </Col>                            
                </Row>          */}
                <Row gutter = { 12 }>
                    <Form.Item label={"Produtos"}>
                        {
                            getFieldDecorator('ordemServico.produtoItemsList', {
                                rules: [{ required: false, type: 'array', message: 'Por favor, informe pelo menos um produto.'}],
                                initialValue: [...produtoItemsList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                                    pagination={false} bordered>
                                    {/* <Table.Column title={<center>Produto</center>} key={"produto"} dataIndex={"produto"} align={"center"} 
                                                render={(produto = {}) => produto.descricao || produto.nome }/> */}                                            
                                    <Table.Column title={<center>Produto</center>} key={"nomeProduto"} dataIndex={"nomeProduto"} align={"center"} />  
                                    <Table.Column title={<center>Qtd. caixas</center>} key={"qtdCaixaCalc"} dataIndex={"qtdCaixaCalc"} align={"center"}
                                        render={(text, record) => record.quantidade / record.quantidadeCaixa  } />    
                                    <Table.Column title={<center>Qtd. unidades</center>} key={"quantidade"} dataIndex={"quantidade"} align={"center"} />                                                                                                                    
                                    {/* <Table.Column title={<center>Qtd. (unds)</center>} key={"quantidade"} dataIndex={"quantidade"} align={"center"} /> */}
                                    <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                    <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                    <Table.Column title={<center>Total</center>} key={"total"} dataIndex={"total"} align={"center"}
                                        render={(text, record) => record.quantidade * (record.valor - record.desconto) } />
                                    <Table.Column title={<center>Bonificação</center>} key={"bonificacao"} dataIndex={"bonificacao"} align={"center"}
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

//export default TabProduto

// const mapStateToProps = (state) => {

//     return {
//         ...state.visitante.data,
//         visitante: state.visitante.visitante,
//         state: state.visitante.state,
//         fetching: state.visitante.fetching,   
//         profile: state.login.data.profile,      
//     }
// }

// const mapDispatchToProps = (dispatch) => ({
//     buscarCustodiado: (obj) => dispatch(VisitanteActions.visitanteBuscarCustodiado(obj)),
//     setRelacoes: (produtoItemsList) => dispatch(VisitanteActions.visitanteSetRelacoes(produtoItemsList))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(TabRelacoes)