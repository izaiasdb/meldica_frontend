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
                const { tabelaPreco } = this.props
                
                if (tabelaPreco.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setTabelaPreco(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    render() {
        const { activeKey } = this.state
        const { fetching, tabelaPreco, form } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { id, idUsuarioInclusao, qtdEstoqueMinimo, tipo, atualizaEstoque} = isNil(tabelaPreco) ? {} : tabelaPreco

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Tabela de Preço`) } >                    
                    { getFieldDecorator("tabelaPreco.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("tabelaPreco.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    
                    <Row>
                        <Tabs activeKey={activeKey} type={'card'} onChange={this.setActiveKey}>
                            <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados</span>}>
                                <TabDados {...this.props} />
                            </Tabs.TabPane>  
                            <Tabs.TabPane key={2} tab={<span><Icon type="solution" />Tabela Preços Produtos</span>}>
                                <TabItems form={form} />
                            </Tabs.TabPane>
                        </Tabs>
                    </Row>                    
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"}                             
                            htmlType={"submit"}>
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
        this.props.form.validateFields((err, { tabelaPreco }) => {
            if (!err) {
                const {produtoItemsList = []} = tabelaPreco

                if (produtoItemsList && produtoItemsList.length == 0) {
                    openNotification({tipo: 'warning', descricao: 'Tabela de Preços precisa informar produtos.'})    
                    return 
                }

                this.props.setTabelaPreco(tabelaPreco)
                this.props.salvar(tabelaPreco)
                
                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {
    return {
        ...state.tabelaPreco.data,
        tabelaPreco: state.tabelaPreco.tabelaPreco,
        stateView: state.tabelaPreco.stateView,
        fetching: state.tabelaPreco.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.tabelaPrecoCleanMessage()),
    cleanTable: () => dispatch(Actions.tabelaPrecoCleanTable()),
    setStateView: (stateView) => dispatch(Actions.tabelaPrecoSetStateView(stateView)),
    setTabelaPreco: (tabelaPreco) => dispatch(Actions.tabelaPrecoSetTabelaPreco(tabelaPreco)),    
    salvar: (obj) => dispatch(Actions.tabelaPrecoSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)