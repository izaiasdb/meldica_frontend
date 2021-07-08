import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin, Row, Col, Avatar, Select, Carousel , Form, Input, DatePicker } from 'antd'
import { Bar } from 'react-chartjs-2'
import moment from 'moment'

import DashboardActions from '../redux'
import { cloneDeep, isEmpty, isNil } from 'lodash'
import { generateOptions } from '../../util/helper'

const { Meta } = Card
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class Dashboard extends Component {

    constructor(props){
        super(props)

        this.state = { 
            unidade: {},
            //idTipoDashboard: '1',
            //periodo: "01/" + moment().format('MM/YYYY') //moment().format('DD/MM/YYYY')
        }
    }   

    componentDidMount() {
        const { idTipoDashboard, periodo } = this.state
        //this.pesquisarVenda(idTipoDashboard, periodo)
    }

    // getDatasetForColaboradorTotal = (colaboradorTotal) => {
    //     let data = {
    //         labels: colaboradorTotal.map(ct => ct.tipo),
    //         datasets: [{
    //             label: 'Quantidade de Colaboradores',
    //             data: colaboradorTotal.map(ct => ct.qtd),
    //             backgroundColor: [ '#149647', '#F36A21', '#149647', '#F36A21']
    //         }]
    //     }
    //
    //     return data;
    // }

    // getDatasetForPopulacaoTotalPorUnidade = (populacaoTotalPorUnidade) => {
    //     let data = {
    //         labels: populacaoTotalPorUnidade.map(ct => ct.unidade),
    //         datasets: [{
    //             label: 'População Total da Unidade',
    //             data: populacaoTotalPorUnidade.map(ct => ct.total),
    //             backgroundColor: '#149647'
    //         }]
    //     }
    //
    //     return data;
    // }

    // listarMensagenUnidades = () => {                
    //     const { mensagemUnidade = [] } = this.props
    //     const divs = []
    //
    //     if (mensagemUnidade && mensagemUnidade.length > 0) {
    //         mensagemUnidade.map((mensagem, index) => {
    //             divs.push(<div key={index}><h2>{mensagem.descricao}</h2></div>)
    //         })
    //     }
        
    //     return divs;
    // }   
    
    tipoDashboardHandleChange = (idTipoDashboard) => {
        //const { periodo } = this.state
        const { periodo, setIdTipoDashboard } = this.props
        console.log(`selected ${idTipoDashboard}`);
        //this.setState({ idTipoDashboard })

        if (!isNil(periodo)){
            setIdTipoDashboard(idTipoDashboard)
            this.pesquisarVenda(idTipoDashboard, periodo)
        }
    }

    dataHandleChange = (date, dateString) => {
        //const { idTipoDashboard } = this.state
        //const { data = {} } = this.props
        const { idTipoDashboard, setPeriodo } = this.props
        //const { idTipoDashboard } = data || {}

        if (!isNil(idTipoDashboard)){
            console.log(date, dateString);
            //this.setState({ periodo: "01/" + dateString })
            setPeriodo("01/" + dateString)
            this.pesquisarVenda(idTipoDashboard, "01/" + dateString)
        }
    }

    pesquisarVenda(idTipoDashboard, periodo) {
        if (!isNil(idTipoDashboard) && !isNil(periodo)){
            // const data = moment(periodo, 'DD/MM/YYYY')
            // let dataStr = moment(periodo).format('DD/MM/YYYY');

            this.props.pesquisarVenda({ idTipoDashboard, data: periodo })
        }
    }

    getCard = (nome, color, icon, value) => {
        return (<Col span={6}>
            <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}} >
                <Meta 
                    // avatar = { 
                    //     <Avatar size={72} icon={icon} style = {{ color, backgroundColor: '#fff' }}/> 
                    // }
                    title={<span style={{ 'fontSize': '16px', 'fontWeight' : 'bold'}}>{nome}</span>}
                    description = {
                        <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '2em', 'color' : '#000'}}>
                            { value }
                        </div>
                    }
                />
            </Card>
        </Col>)
    }

    getDescricao = (vendaList) => {
        if (vendaList.length > 0) {
            return ( vendaList[0].descricao )
        } else {
            return ( "" )
        }
    }

    render(){
        let { 
            fetching, 
            vendaList = [] ,
            idTipoDashboard,
            periodo,
        } = this.props
        
        //populacaoTotalPorUnidade = cloneDeep(populacaoTotalPorUnidade).sort((a, b) => b.total - a.total)
        let pula = 1;

        return (
            <Spin spinning={ fetching }>
                <Row gutter={24}>
                    <Col span={24}>
                    {/* 'height': '150px'  */}
                        <Card style={{ 'borderRadius' : '1em' , 'height': '100%' }} >
                            <Row gutter={24}>
                                <Col span={4}>
                                    <Form.Item label={"Tipo Dashboard"}>
                                        {
                                             <Select 
                                                defaultValue="GERAL" 
                                                onChange={this.tipoDashboardHandleChange}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style = {{ width: '98%' }}
                                                //style={{ width: 200 }}
                                                >
                                             <OptGroup label="VENDAS">
                                               <Option value="1">GERAL</Option>
                                               <Option value="2">POR VENDEDOR</Option>
                                             </OptGroup>
                                             <OptGroup label="FINANCEIRO">
                                               <Option value=""></Option>
                                             </OptGroup>
                                           </Select>
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item label={"Período"}>
                                        {                                    
                                        <MonthPicker 
                                            onChange={this.dataHandleChange} 
                                            placeholder="Selecione o mês"
                                            format={'MM/YYYY'}
                                            value={new moment(periodo)} 
                                            //value={new moment()} 
                                            //value={new moment(periodo)}
                                        />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            { 
                            // EMPRESA
                            idTipoDashboard == '1' && vendaList.length > 0 &&
                            <>
                            <Row gutter={24}>
                                <Card 
                                    title={`TOTAL VENDA - POR EMPRESA` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                        {
                                            vendaList.map((venda, index) => {
                                                return (
                                                    this.getCard(venda.empresa, '#51BCDA', 'global', venda.valor.toFixed(2))
                                                )
                                            })
                                        }
                                    </Row>
                                </Card>                                                              
                            </Row>
                            <Row gutter={24}>
                                <Card 
                                    title={`QUANTIDADE CAIXA - POR EMPRESA` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                        {
                                            vendaList.map((venda, index) => {
                                                return (
                                                    this.getCard(venda.empresa, '#51BCDA', 'global', venda.caixa.toFixed(2))
                                                )
                                            })
                                        }
                                    </Row>
                                </Card>                                                              
                            </Row>
                            <Row gutter={24}>
                                <Card 
                                    title={`QUANTIDADE VENDA - POR EMPRESA` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                        {
                                            vendaList.map((venda, index) => {
                                                return (
                                                    this.getCard(venda.empresa, '#51BCDA', 'global', venda.venda)
                                                )
                                            })
                                        }
                                    </Row>
                                </Card>                                                              
                            </Row>                                                       
                            </>
                            }
                            { idTipoDashboard == '2' && vendaList.length > 0 &&
                            <>
                            <Row gutter={24}>
                                <Card 
                                    title={`TOTAL VENDA - POR FUNCIONÁRIO` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                    {
                                        vendaList.map((venda, index) => {
                                            return (
                                                this.getCard(venda.empresa + " - " + venda.funcionario, '#51BCDA', 'global', venda.valor.toFixed(2))
                                            )
                                        })
                                    }
                                    </Row>
                                    {/* {
                                        vendaList.map((venda, index) => {
                                            // if (pula == 2) {
                                            return (
                                                <Row gutter={24}>
                                                {                                                
                                                    this.getCard(venda.empresa + " - " + venda.funcionario, '#51BCDA', 'global', venda.valor.toFixed(2))
                                                }
                                                </Row>
                                            )
                                            // } else {
                                            //     pula = 1;
                                            // }
                                        }) 
                                    }                                        */}
                                </Card>                                                              
                            </Row>
                            <Row gutter={24}>
                                <Card 
                                    title={`QUANTIDADE CAIXA - POR FUNCIONÁRIO` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                        {
                                            vendaList.map((venda, index) => {
                                                return (
                                                    this.getCard(venda.empresa + " - " + venda.funcionario, '#51BCDA', 'global', venda.caixa.toFixed(2))
                                                )
                                            })
                                        }
                                    </Row>
                                </Card>                                                              
                            </Row>
                            <Row gutter={24}>
                                <Card 
                                    title={`QUANTIDADE VENDA - POR FUNCIONÁRIO` + this.getDescricao(vendaList)} 
                                    style={{ 'borderRadius' : '1em', margin: '20px',// 'height': '400px' 
                                    }}
                                    >
                                    <Row gutter={24}>
                                        {
                                            vendaList.map((venda, index) => {
                                                return (
                                                    this.getCard(venda.empresa + " - " + venda.funcionario, '#51BCDA', 'global', venda.venda)
                                                )
                                            })
                                        }
                                    </Row>
                                </Card>                                                              
                            </Row>                                                       
                            </>
                            }      
                        </Card>
                    </Col>
                </Row>
            </Spin>
        )
    }

    handleSelectChange = (id, { props: { children : abreviacao} }) => {
        this.props.cleanMensagemUnidade();
        this.props.pesquisarMensagemUnidade({ unidade: [id]  , ativo : [true] , periodoVigente : [true] } )
        this.setState({unidade: {id, abreviacao}})
    }

    getExtra = () => {
        const unidades = []
        const { form: { getFieldDecorator }} = this.props

        return (
            <Form>
                {getFieldDecorator("obj.ativo", { initialValue: true })(<Input type="hidden" />)}
                {/* <Form.Item label={"Unidade prisional"}>
                {
                    getFieldDecorator('obj.unidade', {
                        initialValue: [],
                    })(
                        <Select placeholder={"Selecionar unidades prisionais"}
                            showSearch={true} allowClear={true}
                            optionFilterProp="children" 
                            onSelect={this.handleSelectChange} style={{'width': '200px'}}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                            <Select.Option key={0} value={null}>{"SELECIONE"}</Select.Option>    
                            {generateOptions(unidades && unidades.map(({ id, abreviacao }) => ({ id, descricao: abreviacao })))}
                        </Select>
                    )
                }
                </Form.Item> */}
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.dashboard.data,
        fetching: state.dashboard.fetching,
        idTipoDashboard: state.dashboard.idTipoDashboard,
        periodo: state.dashboard.periodo,
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(DashboardActions.dashboardCleanMessage()),
    cleanMensagemUnidade: ()  => dispatch(DashboardActions.dashboardCleanMensagemUnidade()),
    getPopulacaoTotal: () => dispatch(DashboardActions.dashboardGetPopulacaoTotal()),
    getTotalColaboradorPorTipo: () => dispatch(DashboardActions.dashboardGetTotalColaboradorPorTipo()),
    getPopulacaoTotalPorUnidade: () => dispatch(DashboardActions.dashboardGetPopulacaoTotalPorUnidade()),  
    pesquisarMensagemUnidade: (obj) => dispatch(DashboardActions.dashboardPesquisarMensagemUnidade(obj)),
    pesquisarVenda: (obj) => dispatch(DashboardActions.dashboardPesquisarVenda(obj)),
    setIdTipoDashboard: (idTipoDashboard) => dispatch(DashboardActions.dashboardSetIdTipoDashboard(idTipoDashboard)),
    setPeriodo: (periodo) => dispatch(DashboardActions.dashboardSetPeriodo(periodo)),
})

const wrapedPesquisa = Form.create()(Dashboard)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)