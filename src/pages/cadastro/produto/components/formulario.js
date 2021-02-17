import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabItems from './tabItems'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'

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
                const { produto } = this.props
                
                if (produto.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setProduto(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    render() {
        const { activeKey } = this.state
        const { fetching, produto, form } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { id, idUsuarioInclusao, estoqueMinimoUnidade, estoqueMinimoCaixa, tipo, atualizaEstoque} = isNil(produto) ? {} : produto
        let tipoProdutoForm = getFieldValue("produto.tipo") || tipo
        let obrigaItems = (//tipoProdutoForm == 'P' || 
        tipoProdutoForm == 'C') ? true : false;

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  produto`) } >                    
                    { getFieldDecorator("produto.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("produto.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    { getFieldDecorator("produto.estoqueMinimoUnidade", { initialValue: estoqueMinimoUnidade || 0})(<Input type="hidden" />) }
                    { getFieldDecorator("produto.estoqueMinimoCaixa", { initialValue: estoqueMinimoCaixa || 0})(<Input type="hidden" />) }
                    { getFieldDecorator("produto.atualizaEstoque", { initialValue: isNil(atualizaEstoque) ? true : atualizaEstoque})(<Input type="hidden" />) }
                    
                    <Row>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados {...this.props} />
                            </Tabs.TabPane>  
                            { (tipoProdutoForm == 'P' || tipoProdutoForm == 'C') &&
                            <Tabs.TabPane key={2} tab={<span><Icon type="solution" />Produtos Items</span>}>
                                <TabItems form={form} obrigaItems={obrigaItems} tipoProduto={tipoProdutoForm} />
                            </Tabs.TabPane>
                            }
                        </Tabs>
                    </Row>                    
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"}                             
                            //htmlType={"submit"}
                            onClick={this.handleSubmit}
                            >
                            { this.isSaving() ? 'Salvar' : 'Atualizar' }
                        </Button>
                    </Row>
                </Card>
            </Form>
        </Spin>
        )
    }

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

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { produto }) => {
            if (!err) {
                const {tipo, produtoItemsList = [], valorVenda, quantidadeCaixa, peso } = produto

                if (tipo == 'C' && (produtoItemsList && produtoItemsList.length == 0)) {
                    openNotification({tipo: 'warning', descricao: 'Produto do tipo "COMBINADO" precisa informar itens.'})    
                    return 
                }

                if (valorVenda == 0) {
                    openNotification({tipo: 'warning', descricao: 'Valor venda precisa ser informado.'})    
                    return 
                }

                if (peso == 0) {
                    openNotification({tipo: 'warning', descricao: 'Peso precisa ser informado.'})    
                    return 
                }
                
                if (quantidadeCaixa == 0) {
                    openNotification({tipo: 'warning', descricao: 'Qtd. caixa precisa ser informado.'})    
                    return 
                }                

                this.props.setProduto(produto)
                this.props.salvar(produto)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.produto.data,
        produto: state.produto.produto,
        stateView: state.produto.stateView,
        fetching: state.produto.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.produtoCleanMessage()),
    cleanTable: () => dispatch(Actions.produtoCleanTable()),
    setStateView: (stateView) => dispatch(Actions.produtoSetStateView(stateView)),
    setProduto: (produto) => dispatch(Actions.produtoSetProduto(produto)),    
    salvar: (obj) => dispatch(Actions.produtoSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)