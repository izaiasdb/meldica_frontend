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
        return (
            <Card 
                //extra={this.getExtra(list.length)}
                bordered={false} >
                <Table 
                    title={() => getTitleTable(`RELATÓRIO PRODUZIR`) }
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
        ...state.relatorioProduzir.data,
        fetching: state.relatorioProduzir.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //cleanMessage: () => dispatch(Action.relatorioProduzirCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)