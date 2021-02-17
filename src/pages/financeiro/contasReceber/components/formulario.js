import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal, Col, Avatar, Divider } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING, EDITING, VIEWING  } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabPagRecItem from './tabPagRecItem'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { getCard } from '../../../util/miniCard'

const { Meta } = Card

class Formulario extends Component {

    constructor(props){
        super(props)
        this.state = { activeKey: "1", visible: false, }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)

            if (isEqual(message.tipo, 'success')) {
                const { contasReceber } = this.props

                this.props.cleanTable()
                this.props.setStateView(SEARCHING)
                this.handleReset()
                this.props.setContasReceber(null)
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    showModal = (record) => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
          visible: false,
        });
    };
    
    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    render() {
        const { activeKey } = this.state
        const { fetching, contasReceber, form, stateView, tipoTela } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const {
            id,
            idUsuarioInclusao,
            receitaDespesa,
            valor,
            valorPago,
            selecionado,
            pagarReceberItemsList = [], 
        } = isNil(contasReceber) ? {} : contasReceber

        //let produtoItemsListForm = getFieldValue("contasReceber.pagarReceberItemsList") || produtoItemsList
        //let totalForma = produtoItemsListForm.reduce((acum,{valor}) => acum + Number(valor), 0);
        let receitaDespesaInsert = isEqual(tipoTela, 'PAGAR') ? 'D' : 'R'
        
        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Contas a ${isEqual(tipoTela, 'PAGAR') ? 'Pagar': 'Receber'}`) } >
                    { getFieldDecorator("contasReceber.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("contasReceber.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    { getFieldDecorator("contasReceber.receitaDespesa", { initialValue: isNil(receitaDespesa) ? receitaDespesaInsert : receitaDespesa})(<Input type="hidden" />) }
                    {/* { getFieldDecorator("contasReceber.statusNota", { initialValue: isNil(statusNota) ? 'A' : statusNota})(<Input type="hidden" />) } */}
                    { getFieldDecorator("contasReceber.selecionado", { initialValue: isNil(selecionado) ? false : selecionado})(<Input type="hidden" />) }
                    { getFieldDecorator("contasReceber.valorPago", { initialValue: isNil(valorPago) ? 0 : valorPago})(<Input type="hidden" />) }
                    <Row gutter={12}>
                        <Col span={ 6 }>
                        {
                            getCard('Valor Documento', '#FBC658', 'sketch', valor ? valor : 0, true, true)
                        }
                        </Col>
                        <Col span={ 6 }>
                        {
                            getCard(`Valor ${isEqual(tipoTela, 'PAGAR') ? 'Pago': 'Recebido'}`, '#DA120B', 'dollar', valorPago ? valorPago : 0, true, true)
                        }
                        </Col>
                    </Row>
                    <Row>
                        <TabDados {...this.props} />
                    </Row>
                    <Divider />
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"}
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>                        
                        { (isEqual(stateView, 'PAGAR') || isEqual(stateView, EDITING) || isEqual(stateView, VIEWING)) &&
                        <Button type={ "primary"}
                                onClick={(e) => this.showModal()}
                                style={{marginRight: '10px'}}>
                                { isEqual(stateView, VIEWING) ? 'Visualizar Documentos' : `Adicionar ${isEqual(tipoTela, 'PAGAR') ? 'Pagamentos': 'Recebimentos'} `}
                        </Button> }                     
                        <Button type={"primary"}
                            //htmlType={"submit"}
                            onClick={this.handleSubmit}
                            disabled= {isEqual(stateView, VIEWING)}
                            >
                            { this.isSaving() ? 'Salvar' : 'Atualizar' } Contas a {isEqual(tipoTela, 'PAGAR') ? 'Pagar': 'Receber'}
                        </Button>
                    </Row>
                </Card>

                <Modal
                    title={getTitle(`${isEqual(tipoTela, 'PAGAR') ? 'Pagamentos': 'Recebimentos'}`)}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width = {1000}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <TabPagRecItem {...this.props} tipoTela={tipoTela} />
                </Modal>            
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
        this.props.form.validateFields((err, { contasReceber }) => {
            if (!err) {
                //const { produtoItemsList = [], formaItemsList = [] } = contasReceber
                // let totalProduto = produtoItemsList.reduce((acum,{valor, quantidade}) => acum + (Number(quantidade) * Number(valor)), 0);
                // let totalForma = formaItemsList.reduce((acum,{valor}) => acum + Number(valor), 0);

                // if (totalProduto < totalForma){
                //     openNotification({tipo: 'warning', descricao: 'Total de forma de pagamento não pode ser maior que o total de produtos.'})
                //     return
                // }

                if (contasReceber.valor == 0){
                    openNotification({tipo: 'warning', descricao: 'Por favor informe um valor para o documento!.'})
                    return
                }

                // if (!isNil(contasReceber.tipoLancamento) && contasReceber.tipoLancamento == 2 && isNil(contasReceber.formaCondicaoPagamento)){
                //     openNotification({tipo: 'warning', descricao: 'Forma condição precisa ser informada para lançamento do tipo PARCELADO!'})
                //     return
                // }

                this.props.setContasReceber(contasReceber)
                this.props.salvar(contasReceber)

                this.setActiveKey('1')
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

}

const mapStateToProps = (state) => {
    return {
        ...state.contasReceber.data,
        contasReceber: state.contasReceber.contasReceber,
        stateView: state.contasReceber.stateView,
        fetching: state.contasReceber.fetching,
        //tipoTela: state.contasReceber.tipoTela,
        profile: state.login.data.profile,
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.contasReceberCleanMessage()),
    cleanTable: () => dispatch(Actions.contasReceberCleanTable()),
    setStateView: (stateView) => dispatch(Actions.contasReceberSetStateView(stateView)),
    setContasReceber: (contasReceber) => dispatch(Actions.contasReceberSetContasReceber(contasReceber)),
    salvar: (obj) => dispatch(Actions.contasReceberSalvar(obj)),
    excluirItem: (obj) => dispatch(Actions.contasReceberExcluirItem(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)