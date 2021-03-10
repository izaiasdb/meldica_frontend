import React, { Component } from 'react'
import { Card, Table, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import Workbook from 'react-excel-workbook'
import moment from 'moment'

import Action from '../redux'
import Pagination from '../../../util/Pagination'
import { getTitleTable } from '../../../util/helper'
import { isEqual, isNil } from 'lodash'


const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    render() {
        const { list = [] } = this.props

        const produtoExpandedRowRender = (record, recordFilho, index, indent, expanded) => {
            const {itemList = []} = record
            //let dataSourceList = kitProdutoList.filter(c => c.idOrdemServicoKit == record.id)
            //console.log('debug record' , record)
            //const dataSourceList = !isNil(record) && !isNil(record.unidade) ? record.unidade : [] 
            let dataSourceList = itemList.filter(c => c.idGrupoProduto == recordFilho.id)

            if (!isNil(dataSourceList) && dataSourceList.length > 0) {
                return (
                    <Table dataSource={dataSourceList}
                        rowKey={(row) => row.id}
                        pagination={false}>
                        
                        <Table.Column title={<center>Produto</center>} key={"produto"} dataIndex={"produto"} align={"center"} />  
                        <Table.Column title={<center>Quantidade</center>} key={"quantidade"} dataIndex={"quantidade"} align={"center"} />
                        <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                        <Table.Column title={<center>Total</center>} key={"total"} dataIndex={"total"} align={"center"}
                            render={(text, record) => record.quantidade * record.valor} />                          
                    </Table>
                )
            } else {
                return (
                    <Table dataSource={[]}
                        pagination={false} />
                )
            }
        };            

        const expandedRowRender = (record, index, indent, expanded) => {
            const {grupoProdutoList = []} = record
            //let dataSourceList = kitProdutoList.filter(c => c.idOrdemServicoKit == record.id)
            console.log('debug record' , record)
            //const dataSourceList = !isNil(record) && !isNil(record.unidade) ? record.unidade : [] 

            if (!isNil(grupoProdutoList) && grupoProdutoList.length > 0) {
                return (
                    <Table dataSource={grupoProdutoList}
                        rowKey={(row) => row.id}
                        pagination={false}
                        expandedRowRender={(recordFilho, index, indent, expanded) => produtoExpandedRowRender(record, recordFilho, index, indent, expanded) }>
                        
                        <Table.Column title={<center>Linha Produto</center>} key={"nome"} dataIndex={"nome"} align={"center"} />                          
                    </Table>
                )
            } else {
                return (
                    <Table dataSource={[]}
                        pagination={false} />
                )
            }
        };          

        return (
            <Card 
                //extra={this.getExtra(list.length)}
                bordered={false} >
                <Table 
                    title={() => getTitleTable(`RELATÓRIO RESUMO MENSAL`) }
                    rowKey={(row) => row.id}
                    dataSource={list} 
                    size={"middle"}
                    pagination={Pagination(50)} 
                    expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) }>
                    <Table.Column key={'id'}
                        dataIndex={'id'}
                        title={'Relatório mensal'}
                        align={"center"} />                         
                    <Table.Column key={'avista'}
                        dataIndex={'avista'}
                        title={'Total à vista'}
                        align={"center"} />  
                    {/* <Table.Column key={'planoConta'}
                        dataIndex={'planoConta'}
                        title={'Plano de Conta'}
                        align={"left"} />    
                    <Table.Column key={'valor'}
                        dataIndex={'valor'}
                        title={'Valor'}
                        align={"left"} />  
                    <Table.Column key={'valorPago'}
                        dataIndex={'valorPago'}
                        title={`Valor ${isEqual(tipoTela, 'PAGAS') ? 'pago': 'recebido'}`}
                        align={"left"} />                           */}
                                                                     
                </Table>
            </Card>
        )
    }

    getExtra = (length) => {
        return length && length > 0 ? this.getDownloadExcel() : null
    }

    getDownloadExcel = () => {        
        return (<Workbook filename='relatorio_pagas_recebidas.xlsx'
            element={
                <Tooltip title='Click para baixar os registros.' placement='left'>
                    <Button type='primary' shape='circle' size='small' icon='download' />
                </Tooltip>
            }>
            <Sheet data={this.props.list || []} name='relatorio_pagas_recebidas' >
                <Column label='Número da Conta' value={row => row.numeroConta } />
                <Column label='Plano de Conta' value={row => row.planoConta } />
                <Column label='Valor' value={row => row.valor } />
                <Column label={`Valor pago`} value={row => row.valorPago } />
            </Sheet>
        </Workbook>)
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioResumoMensal.data,
        fetching: state.relatorioResumoMensal.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //cleanMessage: () => dispatch(Action.relatorioResumoMensalCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)