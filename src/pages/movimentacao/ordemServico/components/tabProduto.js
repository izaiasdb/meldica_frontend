import React from 'react'
import { connect } from 'react-redux'
//import VisitanteActions from '../redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
//import { hasAnyAuthority } from '../../../../services/authenticationService'
import { INSERTING, EDITING } from '../../../util/state'
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
            produtoList, 
        } = this.props
        const { viewStateTab } = this.state

        let { osProduto } = getFieldsValue(['osProduto'])
        let produtoItemsList = getFieldValue("ordemServico.produtoItemsList")
        let { id, produto, quantidade, valor } = osProduto      
        
        if(!(produto && produto.id && quantidade && valor)){
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

        // if (this.state.produtoDescricao && this.state.produtoDescricao != ''){
        //     produto.nome = this.state.produtoDescricao              
        // }        
               
        produtoItemsList.push({...osProduto})

        setFieldsValue({ordemServico: { produtoItemsList } }, () => {
            setFieldsValue({
                osProduto: { id: null,
                    produto: { id: null},
                    quantidade: 1, 
                    valor: 0 
                }
            })
        })

        this.setState({ produtoDescricao: null, viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osProduto: {...record } } )
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
        const { form: { getFieldsValue, setFieldsValue }, produtoList = [], } = this.props    
        const { osProduto } = getFieldsValue()       
        const { percDesconto } = osProduto 

        let produtoForm = produtoList.find(c=> c.id == idProduto);

        let vValorDesconto = obterValorDesconto(percDesconto, produtoForm.valorVenda);
        let vPercDesconto = obterPercentualDesconto(vValorDesconto, produtoForm.valorVenda);

        setFieldsValue({osProduto: {
                ...osProduto, 
                valor: produtoForm.valorVenda,
                desconto: vValorDesconto,
                percDesconto: vPercDesconto,
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

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osProduto = {
            produto: { id: null},
            quantidade: 1, 
            valor: 0 
        }

        setFieldsValue(fields)
    }   

    render() {
        const { viewStateTab, produtoDescricao } = this.state
        const { 
            form,        
            produtoList = [],
            ordemServico = {},        
        } = this.props
        const { produtoItemsList = [] } = ordemServico || {}
        const { getFieldDecorator, getFieldValue } = form

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        const id = getFieldValue("osProduto.id") || null    
        const idProduto = getFieldValue("osProduto.produto.id") || null
        const quantidade = getFieldValue("osProduto.quantidade") || null
        let produtoListFilter = produtoList.filter(c=> c.tipo == 'P')
        let totalProduto = 0;
        let produtoForm = null;  
        let percDescontoMaximo = 0;      

        if (idProduto && quantidade) {        
            produtoForm = produtoList.find(c=> c.id == idProduto);
            totalProduto = produtoForm.valorVenda * quantidade;
            percDescontoMaximo = produtoForm.percDescontoMaximo;
        }

        const produtoNome = getFieldValue("osProduto.produto.nome") || produtoDescricao
        
        return (<div>
            { getFieldDecorator("osProduto.id", { initialValue: id })(<Input type="hidden" />) }
            { getFieldDecorator("osProduto.produto.nome", { initialValue: produtoNome })(<Input type="hidden" />) }        
            {/* { getFieldDecorator("osProduto.id", { initialValue: id })(<Input type="hidden" />) } */}        
            {/* { isEqual(viewStateTab, EDITING) && getFieldDecorator("relacao.pessoaRelacao.id", { initialValue: id })(<Input type="hidden" />) } */}
            <Row gutter = { 12 }>
                <Col span = { 6 }>
                    <Form.Item label={"Produto"}>
                        {
                            getFieldDecorator('osProduto.produto.id', {})(
                                <Select showSearch
                                        optionFilterProp="children"
                                        placeholder={"Digite para buscar"}
                                        onChange={(value) => this.handleChangeProduto(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                    {generateOptions(produtoListFilter.map(({id, nome}) => ({id, descricao: nome})))}
                                </Select>
                            )
                        }
                    </Form.Item>               
                </Col>
                <Col span={3}>
                    <Form.Item label={"Quantidade"}>
                        {
                            getFieldDecorator('osProduto.quantidade', {
                                initialValue: 1
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
                <Col span={3}>
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
                            />
                            )
                        }
                    </Form.Item>
                </Col> 
                <Col span={3}>
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
                <Col span={3}>
                    <Form.Item label={"Valor"}>
                        {
                            getFieldDecorator('osProduto.valor', {
                                initialValue: 0
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
            </Row>         
            <Row gutter = { 12 }>
                <Col span={ 3 }>
                    <Form.Item label={<span style={{height: '3px'}} />}>
                        {
                            <Button type={"primary"} onClick={() => this.adicionar(form)}>
                                { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' }
                            </Button>
                        }
                    </Form.Item>
                </Col>
                <Col span={ 3 }>
                    <Form.Item label={<span style={{height: '3px'}} />}>
                        {
                            <Button type={"primary"} onClick={this.limpar} >
                                Limpar
                            </Button>
                        }
                    </Form.Item>
                </Col>
            </Row>
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
                                <Table.Column title={<center>Quantidade</center>} key={"quantidade"} dataIndex={"quantidade"} align={"center"} />
                                <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                <Table.Column title={<center>Total</center>} key={"total"} dataIndex={"total"} align={"center"}
                                    render={(text, record) => record.quantidade * (record.valor - record.desconto) } />
                                <Table.Column title={<center>Ações</center>} key={"actions"} 
                                            dataIndex={"actions"} 
                                            align={"center"} 
                                            render={ (text, record) => {
                                                return (
                                                    <span>
                                                        {
                                                            // !record.id &&
                                                            <>
                                                            <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(record, form) }/>
                                                            <Divider type="vertical"/>
                                                            </>
                                                        }
                                                        {
                                                            record.id &&
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