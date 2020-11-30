import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin, Row, Col, Avatar, Select, Carousel , Form, Input } from 'antd'
import { Bar } from 'react-chartjs-2'
import DashboardActions from '../redux'
import { cloneDeep, isEmpty, isNil } from 'lodash'
import { generateOptions } from '../../util/helper'

const { Meta } = Card

class Dashboard extends Component {

    constructor(props){
        super(props)
        this.state = { unidade: {}}
    }   

    componentDidMount() {
        //this.props.getTotalColaboradorPorTipo();
        //this.props.getPopulacaoTotalPorUnidade();
    }

    getDatasetForColaboradorTotal = (colaboradorTotal) => {
        let data = {
            labels: colaboradorTotal.map(ct => ct.tipo),
            datasets: [{
                label: 'Quantidade de Colaboradores',
                data: colaboradorTotal.map(ct => ct.qtd),
                backgroundColor: [ '#149647', '#F36A21', '#149647', '#F36A21']
            }]
        }

        return data;
    }

    getDatasetForPopulacaoTotalPorUnidade = (populacaoTotalPorUnidade) => {
        let data = {
            labels: populacaoTotalPorUnidade.map(ct => ct.unidade),
            datasets: [{
                label: 'População Total da Unidade',
                data: populacaoTotalPorUnidade.map(ct => ct.total),
                backgroundColor: '#149647'
            }]
        }

        return data;
    }

    listarMensagenUnidades = () => {                
        const { mensagemUnidade = [] } = this.props
        const divs = []

        if (mensagemUnidade && mensagemUnidade.length > 0) {
            mensagemUnidade.map((mensagem, index) => {
                divs.push(<div key={index}><h2>{mensagem.descricao}</h2></div>)
            })
        }
        
        return divs;
    }    

    render(){
        let { 
            fetching, 
            totalColaboradorPorTipo = [], 
            populacaoTotalPorUnidade = []  
        } = this.props
        
        const { unidade = {} } = this.state
        populacaoTotalPorUnidade = unidade.id ? populacaoTotalPorUnidade.filter(i => i.unidade == unidade.abreviacao) : populacaoTotalPorUnidade
        populacaoTotalPorUnidade = cloneDeep(populacaoTotalPorUnidade).sort((a, b) => b.total - a.total)

        return (
            <Spin spinning={ fetching }>
                <Row gutter={24}>
                    {/* <Col span={6}>
                        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}} >
                            <Meta avatar = {
                                    <Avatar size={72} icon={"global"} style = {{ color : '#FBC658', backgroundColor : '#fff' }}/>
                                }
                                title={<span style={{ 'fontWeight' : 'bold'}}>População Total</span>}
                                description = {
                                    <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '2em', 'color' : '#000'}}>
                                    {
                                        isNil(populacaoTotalPorUnidade) || isEmpty(populacaoTotalPorUnidade) ? "" : populacaoTotalPorUnidade.reduce((acum,{total}) => acum+Number(total), 0)
                                    }
                                    </div>
                                }
                            />
                        </Card>
                    </Col> */}
                    {/* <Col span={6}>
                        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}}>
                            <Meta avatar = {
                                    <Avatar size={72} icon={"solution"} style = {{ color : '#6BD098', backgroundColor : '#fff' }}/>
                                }
                                title={<div style={{ 'fontWeight' : 'bold', 'textAlign': 'center'}}>Servidores</div>}
                                description = {
                                    <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '2em', 'color' : '#000'}}>
                                    {
                                        isNil(totalColaboradorPorTipo) || isEmpty(totalColaboradorPorTipo) ? "" : totalColaboradorPorTipo.find(i => i.tipo === 'SERVIDOR').qtd
                                    }
                                    </div>
                                }
                            />
                        </Card>
                    </Col> */}
                    {/* <Col span={6}>
                        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}}>
                            <Meta avatar = {
                                    <Avatar size={72} icon={"solution"} style = {{ color : '#51BCDA', backgroundColor : '#fff' }}/>
                                }
                                title={<div style={{ 'fontWeight' : 'bold', 'textAlign': 'center'}}>Terceirizados</div>}
                                description = {
                                    <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '2em', 'color' : '#000'}}>
                                    {
                                        isNil(totalColaboradorPorTipo) || isEmpty(totalColaboradorPorTipo) ? "" : totalColaboradorPorTipo.find(i => i.tipo === 'TERCEIRIZADO').qtd
                                    }
                                    </div>
                                }
                            />
                        </Card>
                    </Col> */}
                    {/* <Col span={6}>
                        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}}>
                            <Meta avatar = {
                                    <Avatar size={72} icon={"solution"} style = {{ color : '#DA120B', backgroundColor : '#fff' }}/>
                                }
                                title={<div style={{ 'fontWeight' : 'bold', 'textAlign': 'center' }}>Egressos</div>}
                                description = {
                                    <div style={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize' : '2em', 'color' : '#000'}}>
                                    {
                                        isNil(totalColaboradorPorTipo) || isEmpty(totalColaboradorPorTipo) ? "" : totalColaboradorPorTipo.find(i => i.tipo === 'EGRESSO').qtd
                                    }
                                    </div>
                                }
                            />
                        </Card>
                    </Col> */}
                </Row>                
                <Row gutter={24}>
                    {/* <Col span={24}>
                        <Card style={{ 'borderRadius' : '1em', 'marginBottom' : '10px'}} extra={this.getExtra()}>
                        {
                            unidade && unidade.id == null &&
                            <Bar data={this.getDatasetForPopulacaoTotalPorUnidade(populacaoTotalPorUnidade)}></Bar>
                        }
                        {
                            unidade && unidade.id != null && 
                            <Carousel effect={'fade'} autoplay>
                                { this.listarMensagenUnidades() }
                            </Carousel>
                        }
                        </Card>
                    </Col> */}
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
        fetching: state.dashboard.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(DashboardActions.dashboardCleanMessage()),
    cleanMensagemUnidade: ()  => dispatch(DashboardActions.dashboardCleanMensagemUnidade()),
    getPopulacaoTotal: () => dispatch(DashboardActions.dashboardGetPopulacaoTotal()),
    getTotalColaboradorPorTipo: () => dispatch(DashboardActions.dashboardGetTotalColaboradorPorTipo()),
    getPopulacaoTotalPorUnidade: () => dispatch(DashboardActions.dashboardGetPopulacaoTotalPorUnidade()),  
    pesquisarMensagemUnidade: (obj) => dispatch(DashboardActions.dashboardPesquisarMensagemUnidade(obj)),  
})

const wrapedPesquisa = Form.create()(Dashboard)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)