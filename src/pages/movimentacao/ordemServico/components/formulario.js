import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal, Col, Avatar, Divider,  } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING, VIEWING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabProduto from './tabProduto'
import TabKit from './tabKit'
import TabForma from './tabForma'
import TabPagarReceber from './tabPagarReceber'
import TabEndereco from './tabEndereco'
import TabTransportadora from './tabTransportadora'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { getCard } from '../../../util/miniCard'
import DrawerTabelaPreco from './drawerTabelaPreco'
import DrawerInfoCliente from './drawerInfoCliente'

const { Meta } = Card

class Formulario extends Component {
    
    constructor(props){
        super(props)
        this.state = { activeKey: "1" }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                this.props.cleanTable()
                this.props.setStateView(SEARCHING)                
                this.handleReset()
                this.props.setOrdemServico(null)                
            }

            this.props.cleanMessage()
        }
    }

    componentDidMount() {
        const { ordemServico, obter } = this.props
        const { id } = isNil(ordemServico) ? {} : ordemServico        

        if(!isNil(id)){
            obter(id)
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    getExtra = () => {
        const { stateView } = this.props

        return (
            <div>
                <Button 
                    type={ "primary"} 
                    onClick={this.voltar}
                    style={{marginRight: '10px'}}>
                        Voltar
                </Button>
                <Divider type="vertical" />
                <Button 
                    type={"primary"}
                    disabled= {isEqual(stateView, VIEWING)}                             
                    //htmlType={"submit"} // Tava comentado
                    onClick={this.handleSubmit}
                    //onClick={this.salvar}
                    >                            
                    { this.isSaving() ? 'Salvar' : 'Atualizar' } Pedido
                </Button>
            </div>
        )
    }

    render() {
        const { activeKey } = this.state
        const { fetching, ordemServico, form, stateView, drawerVisivel, drawerInfoClienteVisivel, drawerKitVisivel, kitProdutoList = []} = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { 
            id, 
            idUsuarioInclusao, 
            statusNota, 
            statusNovaDescricao, 
            cancelado, 
            estoqueGerado,
            formaGerada,
            valorPago, 
            desconto,
            produtoItemsList = [], formaItemsList = [], transportadoraItemsList = [], kitList = []
        } = isNil(ordemServico) ? {} : ordemServico

        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")
        let idClienteFrm = getFieldValue("ordemServico.cliente.id")
        
        //console.log(getFieldValue("ordemServico.produtoItemsList"))
        //console.log(produtoItemsList)
        //let produtoItemsListForm = getFieldValue("ordemServico.produtoItemsList") || produtoItemsList
        //let transportadoraItemsListForm = getFieldValue("ordemServico.transportadoraItemsList") || transportadoraItemsList
        let produtoItemsListForm = isNil(getFieldValue("ordemServico.produtoItemsList")) ? produtoItemsList : getFieldValue("ordemServico.produtoItemsList");
        let kitProdutoListForm = isNil(getFieldValue("ordemServico.kitProdutoList")) ? kitProdutoList : getFieldValue("ordemServico.kitProdutoList");
        let formaItemsListForm = isNil(getFieldValue("ordemServico.formaItemsList"))  ? formaItemsList : getFieldValue("ordemServico.formaItemsList"); 
        let transportadoraItemsListForm = isNil(getFieldValue("ordemServico.transportadoraItemsList"))  ? transportadoraItemsList : getFieldValue("ordemServico.transportadoraItemsList"); 

        //let totalProduto = produtoItemsListForm.filter(c=> c.bonificacao == false).reduce((acum,{valor, quantidade}) => acum + (Number(quantidade) * Number(valor)), 0);
        let totalProdutoMeldica = produtoItemsListForm.filter(c=> c.bonificacao == false && c.idEmpresaProduto != 2).reduce((acum, {total}) => acum + total, 0);        
        let totalProdutoCosmetico = produtoItemsListForm.filter(c=> c.bonificacao == false && c.idEmpresaProduto == 2).reduce((acum, {total}) => acum + total, 0);        
        let totalProdutoKit = kitProdutoListForm.filter(c=> c.bonificacao == false).reduce((acum, {total}) => acum + total, 0);
        let totalPesoProd = produtoItemsListForm.reduce((acum,{pesoUnidade, quantidadeUnidade}) => acum + (Number(quantidadeUnidade) * Number(pesoUnidade)), 0);
        let totalProdutoCxDesconto = produtoItemsListForm.filter(c=> c.bonificacao == false && c.fracionado == false).reduce((acum, {desconto, quantidadeCaixa}) => acum + desconto * quantidadeCaixa, 0);
        let totalProdutoUnidadeDesconto = produtoItemsListForm.filter(c=> c.bonificacao == false && c.fracionado).reduce((acum, {desconto, quantidadeUnidade}) => acum + desconto * quantidadeUnidade, 0);
        let totalProdutoKitDesconto = kitProdutoListForm.filter(c=> c.bonificacao == false).reduce((acum, {desconto, quantidadeUnidade}) => acum + desconto * quantidadeUnidade, 0);
        //let totalPesoKit = kitProdutoList.reduce((acum,{pesoUnidade, quantidadeUnidade}) => acum + (Number(quantidadeUnidade) * Number(pesoUnidade)), 0);
        let totalPesoKit = kitList.reduce((acum,{peso}) => acum + peso, 0);
        let totalVolumeProd = produtoItemsListForm.reduce((acum,{quantidadeUnidade, quantidadeNaCaixa}) => acum + (Number(quantidadeUnidade) / Number(quantidadeNaCaixa)), 0);
        let totalVolumeKit = kitList.reduce((acum,) => acum + 1, 0);
        let totalForma = formaItemsListForm.reduce((acum,{valor, desconto }) => acum + Number(valor), 0);
        let totalDescForma = formaItemsListForm.filter(c=> c.tipoForma == "P").reduce((acum,{desconto}) => acum + Number(desconto), 0);
        let totalFormaDescontos = formaItemsListForm.reduce((acum,{descontoFormaCondicao, desconto }) => acum + Number(descontoFormaCondicao + desconto), 0);
        let totalFrete = transportadoraItemsListForm.reduce((acum,{valorFrete}) => acum + Number(valorFrete), 0);
        let totalPedido = (totalProdutoMeldica ? totalProdutoMeldica : 0) + (totalProdutoCosmetico ? totalProdutoCosmetico : 0) +  (totalProdutoKit ? totalProdutoKit : 0) + (totalFrete ? totalFrete : 0);
        //let faltaReceber = totalPedido - (valorPago ? valorPago : 0) - (totalFormaDescontos ? totalFormaDescontos : 0);
        let faltaReceber = totalPedido - (valorPago ? valorPago : 0) - (totalDescForma ? totalDescForma : 0);
        let totalNFCaixa = produtoItemsListForm.filter(c=> c.fracionado == false).reduce((acum,{ valorNfCaixa, quantidadeCaixa}) => acum + (Number(quantidadeCaixa) * Number(valorNfCaixa)), 0);
        let totalNFUnidade = produtoItemsListForm.filter(c=> c.fracionado == true).reduce((acum,{ valorNfUnidade, quantidadeUnidade}) => acum + (Number(quantidadeUnidade) * Number(valorNfUnidade)), 0);
        let totalNFKit = kitList.reduce((acum,{ valorNf}) => acum + valorNf, 0);
        let totalProdutoDesconto = totalProdutoCxDesconto + totalProdutoUnidadeDesconto + totalProdutoKitDesconto;
        
        let totalNF = totalNFUnidade + totalNFCaixa + totalNFKit;
        let faltaFormaPgto = totalPedido - totalForma;
        let totalVolume = totalVolumeProd + totalVolumeKit;
        let totalPeso = totalPesoProd + totalPesoKit;
        // A bonificação tem que somar o total de peso, volume e NF

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${isEqual(stateView, VIEWING) ? 'Visualizando' : (this.isSaving() ? 'Cadastro' : 'Edição')} Pedido`) } 
                    extra={this.getExtra()}>                    
                    { getFieldDecorator("ordemServico.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.statusNota", { initialValue: isNil(statusNota) ? 'A' : statusNota})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.cancelado", { initialValue: isNil(cancelado) ? false : cancelado})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.valorPago", { initialValue: isNil(valorPago) ? 0 : valorPago})(<Input type="hidden" />) }                    
                    { getFieldDecorator("ordemServico.desconto", { initialValue: isNil(desconto) ? 0 : desconto})(<Input type="hidden" />) }       
                    { getFieldDecorator("ordemServico.estoqueGerado", { initialValue: isNil(estoqueGerado) ? false : estoqueGerado})(<Input type="hidden" />) }             
                    { getFieldDecorator("ordemServico.formaGerada", { initialValue: isNil(formaGerada) ? false : formaGerada})(<Input type="hidden" />) }
                    {/* { getFieldDecorator("ordemServico.kitProdutoList", { initialValue: isNil(kitProdutoList) ? [] : kitProdutoList})(<Input type="hidden" />) }              */}
                    <Row gutter={2}>
                        {/* { id &&
                            this.getCard('Número Nota', '#6BD098', 'file-protect', id, false)
                            //dollar, global, solution, safety
                            //#51BCDA
                        } */}
                        <Col span={ 3 }>
                        {
                            getCard(`${id ? 'Nota: ' + id : 'Status Nota'}`, '#6BD098', 'file-protect', statusNovaDescricao ? statusNovaDescricao : 'ABERTA', false)
                        }   
                        </Col>                                  
                        <Col span={ 3 }>
                        {
                            getCard('Produtos(Naturais)', '#FBC658', 'code-sandbox', totalProdutoMeldica)
                        }
                        </Col>
                        <Col span={ 3 }>
                        {
                            getCard('Produtos(Cosmético)', '#FBC658', 'code-sandbox', totalProdutoCosmetico)
                        }
                        </Col>                        
                        {/* <Col span={ 3 }>
                        {
                            getCard('Total kit produtos', '#FBC658', 'code-sandbox', totalProdutoKit)
                        }
                        </Col>                                                 */}
                        <Col span={ 3 }>
                        {
                            getCard('Total frete', '#6BD098', 'car', totalFrete ? totalFrete : 0)
                        }
                        </Col>
                        <Col span={ 3 }>
                        {
                            getCard('Total a pagar', '#6BD098', 'dollar', totalPedido ? totalPedido : 0)
                        }
                        </Col>                            
                        {/* <Col span={ 3 }>
                        {
                            getCard('Forma pgto.', '#6BD098', 'sketch', totalForma)
                        }
                        </Col> */}
                        <Col span={ 3 }>
                        {
                            getCard('Valor recebido', '#6BD098', 'dollar', valorPago ? valorPago : 0)
                        }
                        </Col>                          
                      
                    </Row>   
                    <Row gutter={2}>
                        <Col span={ 3 }>
                        {
                            getCard('Total peso', '#FBC658', 'arrow-down', totalPeso ? totalPeso : 0, true, false)
                        } 
                        </Col>
                        <Col span={ 3 }>
                        {
                            getCard('Total volume', '#FBC658', 'appstore', totalVolume, true, false)
                        }  
                        </Col>
                        <Col span={ 3 }>                            
                        {
                            getCard('Total Nota Fiscal', '#6BD098', 'dollar', totalNF ? totalNF : 0)
                        }
                        </Col>                          
                        {/* <Col span={ 3 }>
                        {
                            getCard('Tot. produtos(Cosméticos)', '#FBC658', 'code-sandbox', totalProduto)
                        }
                        </Col>                           */}
                        <Col span={ 3 }>
                        {
                            getCard('Tot. desc. produto', '#FBC658', 'code-sandbox', totalProdutoDesconto, true, false)
                        }  
                        </Col>     
                        <Col span={ 3 }>
                        {
                            getCard('Tot. desc. forma', '#FBC658', 'code-sandbox', totalDescForma, true, false)
                        }  
                        </Col>     
                        {/* <Col span={ 3 }>
                        {
                            getCard('Falta forma.', '#DA120B', 'sketch', faltaFormaPgto)
                        }
                        </Col> */}
                        <Col span={ 3 }>
                        {
                            getCard('Falta receber', '#6BD098', 'dollar', faltaReceber, true, true, true)
                        }   
                        </Col>   
                    </Row>                 
                    {/* <Divider /> */}
                    <Row>
                        <TabDados {...this.props} 
                            showDrawer={this.showDrawer} 
                            showDrawerInfoCliente={this.showDrawerInfoCliente} 
                            onCloseDrawer={this.onCloseDrawer}
                            onCloseDrawerInfoCliente={this.onCloseDrawerInfoCliente} />
                    </Row>
                    <Row>
                        <TabEndereco {...this.props} />
                    </Row>  
                    <Row>
                        <TabProduto {...this.props} />
                    </Row>
                    <Row>
                        <TabKit {...this.props} 
                            showDrawerKit={this.showDrawerKit} 
                            onCloseDrawerKit={this.onCloseDrawerKit} 
                            setKitProdutoListEvent= {this.setKitProdutoListEvent}
                            drawerKitVisivel={drawerKitVisivel} />
                    </Row>
                    <Row>
                        <TabForma {...this.props} />
                    </Row>  
                    <Row>
                        <TabTransportadora {...this.props} />
                    </Row>  
                    <Row>
                        <TabPagarReceber {...this.props} />
                    </Row>                      
 
                    <Divider />                  
                    <Row style={{textAlign: "right"}}>
                        <Button 
                            type={ "primary"} 
                            onClick={this.voltar}
                            style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button 
                            type={"primary"}
                            disabled= {isEqual(stateView, VIEWING)}                             
                            //htmlType={"submit"} // Tava comentado
                            onClick={this.handleSubmit}
                            //onClick={this.salvar}
                            >                            
                            { this.isSaving() ? 'Salvar' : 'Atualizar' } Pedido
                        </Button>
                    </Row>
                </Card>
            </Form>
            <DrawerTabelaPreco {...this.props} onCloseDrawer={this.onCloseDrawer} drawerVisivel={drawerVisivel} idTabelaPreco={idTabelaPreco} />
            <DrawerInfoCliente {...this.props} onCloseDrawerInfoCliente={this.onCloseDrawerInfoCliente} drawerInfoClienteVisivel={drawerInfoClienteVisivel} idCliente={idClienteFrm} 
            />
        </Spin>
        )
    }

    /*
    salvar = () => {
        const { confirm } = Modal;
        const { alterarStatus } = this.props;

        confirm({
            title: `Tem certeza que deseja ${titulo}?`,
            content: 'Processo não pode ser DESFEITO!',
            onOk() {
                handleSubmit
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    } */

    isSaving = () => isEqual(this.props.stateView, INSERTING)

    voltar = () => {
        const { confirm } = Modal;
        const { setStateView } = this.props;

        confirm({
            title: 'Tem certeza que deseja sair?',
            content: 'Os dados informados serão perdidos.',
            onOk() {
                setStateView(SEARCHING);
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }

    handleReset = () => {
        this.props.form.resetFields()
    }

    showDrawer = () => {
        this.props.setDrawerVisivel(true);
    };

    onCloseDrawer = () => {
        this.props.setDrawerVisivel(false);
    };

    showDrawerInfoCliente = () => {
        this.props.setDrawerInfoClienteVisivel(true);
    };

    onCloseDrawerInfoCliente = () => {
        this.props.setDrawerInfoClienteVisivel(false);
    };

    showDrawerKit = () => {
        this.props.setDrawerKitVisivel(true);
    };

    onCloseDrawerKit = () => {
        this.props.setDrawerKitVisivel(false);
    };

    setKitProdutoListEvent = (kitProdutoList) => {
        this.props.setKitProdutoList(kitProdutoList);
    };

    handleSubmit = e => {
        const { kitProdutoList = []} = this.props

        e.preventDefault();
        this.props.form.validateFields((err, { ordemServico }) => {
            if (!err) {         
                const { produtoItemsList = [], formaItemsList = [], transportadoraItemsListForm = [] } = ordemServico
                /*
                let totalProduto = produtoItemsList.filter(c=> c.bonificacao == false).reduce((acum,{valor, quantidade}) => acum + (Number(quantidade) * Number(valor)), 0);
                let totalForma = formaItemsList.reduce((acum,{valor}) => acum + Number(valor), 0);
                let totalFrete = transportadoraItemsListForm.reduce((acum,{valorFrete}) => acum + Number(valorFrete), 0);
            
                if ((totalProduto + totalFrete) < totalForma){
                    openNotification({tipo: 'warning', descricao: 'Total de forma de pagamento não pode ser menor que o total de produtos e frete.'})
                    return 
                } */    
                
                if (isNil(ordemServico.kitProdutoList)) {
                    ordemServico.kitProdutoList = kitProdutoList
                }

                this.props.setOrdemServico(ordemServico)
                this.props.salvar(ordemServico)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.ordemServico.data,
        ordemServico: state.ordemServico.ordemServico,
        stateView: state.ordemServico.stateView,
        fetching: state.ordemServico.fetching,  
        drawerVisivel: state.ordemServico.drawerVisivel,  
        drawerKitVisivel: state.ordemServico.drawerKitVisivel, 
        drawerInfoClienteVisivel: state.ordemServico.drawerInfoClienteVisivel, 
        kitProdutoList: state.ordemServico.kitProdutoList,  
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    obter: (id) => dispatch(Actions.ordemServicoObter(id)),    
    cleanMessage: ()  => dispatch(Actions.ordemServicoCleanMessage()),
    cleanTable: () => dispatch(Actions.ordemServicoCleanTable()),
    setStateView: (stateView) => dispatch(Actions.ordemServicoSetStateView(stateView)),
    setOrdemServico: (ordemServico) => dispatch(Actions.ordemServicoSetOrdemServico(ordemServico)),    
    salvar: (obj) => dispatch(Actions.ordemServicoSalvar(obj)),
    setDrawerVisivel: (drawerVisivel) => dispatch(Actions.ordemServicoSetDrawerVisivel(drawerVisivel)),
    setDrawerKitVisivel: (drawerKitVisivel) => dispatch(Actions.ordemServicoSetDrawerKitVisivel(drawerKitVisivel)),
    setDrawerInfoClienteVisivel: (drawerInfoClienteVisivel) => dispatch(Actions.ordemServicoSetDrawerInfoClienteVisivel(drawerInfoClienteVisivel)),
    setKitProdutoList: (kitProdutoList) => dispatch(Actions.ordemServicoSetKitProdutoList(kitProdutoList)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)