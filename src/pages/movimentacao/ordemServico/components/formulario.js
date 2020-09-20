import React, { Component } from 'react'
import { Card, Row, Button, Form, Spin, Tabs, Icon, Input, Modal, Col, Avatar } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { SEARCHING, INSERTING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import TabDados from './tabDados'
import TabProduto from './tabProduto'
import TabForma from './tabForma'
import { getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'

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
                const { ordemServico } = this.props
                
                // if (ordemServico.id){
                //     this.props.cleanTable()
                //     this.props.setStateView(SEARCHING)
                // } else {
                //     this.handleReset()
                //     this.props.setOrdemServico(null)
                // }

                this.props.cleanTable()
                this.props.setStateView(SEARCHING)                
                this.handleReset()
                this.props.setOrdemServico(null)                
            }

            this.props.cleanMessage()
        }
    }

    setActiveKey = (activeKey) => this.setState({activeKey})

    getCard = (nome, color, icon, value, formata = true) => {
        var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });          
        
        return (<Col span={6}>
            <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}} id="cardVenda" >
                <Meta avatar = { 
                        <Avatar size={72} 
                                //size="large"
                                icon={icon} 
                                style = {{ color, backgroundColor: '#fff', paddingRight: 0, width: '45px'}}/> }
                      title={<span style={{ 'fontSize': '16px', 'fontWeight' : 'bold'}}>{nome}</span>}
                      description = {
                            <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '1.6em', 'color' : '#000'}}>
                                { formata &&
                                    formatter.format(value)
                                }
                                { !formata &&                                
                                    value
                                }
                            </div>
                      }
                />
            </Card>
        </Col>)
    }    

    render() {
        const { activeKey } = this.state
        const { fetching, ordemServico, form } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { 
            id, 
            idUsuarioInclusao, 
            statusNota, 
            statusNovaDescricao, 
            cancelado, 
            valorPago, 
            desconto,
            produtoItemsList = [], formaItemsList = []
        } = isNil(ordemServico) ? {} : ordemServico

        let produtoItemsListForm = getFieldValue("ordemServico.produtoItemsList") || produtoItemsList
        let formaItemsListForm = getFieldValue("ordemServico.formaItemsList") || formaItemsList

        let totalProduto = produtoItemsListForm.reduce((acum,{valor, quantidade}) => acum + (Number(quantidade) * Number(valor)), 0);
        let totalForma = formaItemsListForm.reduce((acum,{valor}) => acum + Number(valor), 0);

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  OrdemServico`) } >                    
                    { getFieldDecorator("ordemServico.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.statusNota", { initialValue: isNil(statusNota) ? 'A' : statusNota})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.cancelado", { initialValue: isNil(cancelado) ? false : cancelado})(<Input type="hidden" />) }
                    { getFieldDecorator("ordemServico.valorPago", { initialValue: isNil(valorPago) ? 0 : valorPago})(<Input type="hidden" />) }                    
                    { getFieldDecorator("ordemServico.desconto", { initialValue: isNil(desconto) ? 0 : desconto})(<Input type="hidden" />) }                    
                    <Row gutter={12}>
                        {/* { id &&
                            this.getCard('Número Nota', '#6BD098', 'file-protect', id, false)
                            //dollar, global, solution, safety
                            //#51BCDA
                        } */}
                        {
                            this.getCard(`${id ? 'Nota: ' + id : 'Status Nota'}`, '#6BD098', 'file-protect', statusNovaDescricao ? statusNovaDescricao : 'ABERTA', false)
                        }                                               
                        {
                            this.getCard('Total Produtos', '#FBC658', 'code-sandbox', totalProduto)
                        }
                        {
                            this.getCard('Forma Pgto.', '#6BD098', 'sketch', totalForma)
                        }
                        {
                            this.getCard('Valor Recebido', '#DA120B', 'dollar', valorPago ? valorPago : 0)
                        }
                    </Row>                    
                    <Row>
                        <TabDados {...this.props} />
                    </Row>
                    <Row>
                        <TabProduto {...this.props} />
                    </Row>
                    <Row>
                        <TabForma {...this.props} />
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
        this.props.form.validateFields((err, { ordemServico }) => {
            if (!err) {         
                const { produtoItemsList = [], formaItemsList = [] } = ordemServico
                let totalProduto = produtoItemsList.reduce((acum,{valor, quantidade}) => acum + (Number(quantidade) * Number(valor)), 0);
                let totalForma = formaItemsList.reduce((acum,{valor}) => acum + Number(valor), 0);
            
                if (totalProduto < totalForma){
                    openNotification({tipo: 'warning', descricao: 'Total de forma de pagamento não pode ser maior que o total de produtos.'})
                    return 
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
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(Actions.ordemServicoCleanMessage()),
    cleanTable: () => dispatch(Actions.ordemServicoCleanTable()),
    setStateView: (stateView) => dispatch(Actions.ordemServicoSetStateView(stateView)),
    setOrdemServico: (ordemServico) => dispatch(Actions.ordemServicoSetOrdemServico(ordemServico)),    
    salvar: (obj) => dispatch(Actions.ordemServicoSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)