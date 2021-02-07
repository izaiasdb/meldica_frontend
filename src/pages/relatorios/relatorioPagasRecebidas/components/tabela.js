import React, { Component } from 'react'
import { Card, Table, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import Workbook from 'react-excel-workbook'
import moment from 'moment'

import Action from '../redux'
import Pagination from '../../../util/Pagination'
import { getTitleTable } from '../../../util/helper'
import { isEqual } from 'lodash'


const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    render() {
        const { list = [], tipoTela } = this.props

        return (
            <Card extra={this.getExtra(list.length)}
                bordered={false} >
                <Table 
                    title={() => getTitleTable(`RELATÓRIO DE CONTAS ${tipoTela}`) }
                    rowKey={(row) => row.numeroConta}
                    dataSource={list} 
                    size={"middle"}
                    pagination={Pagination(50)} >
                    <Table.Column key={'numeroConta'}
                        dataIndex={'numeroConta'}
                        title={'Número da Conta'}
                        align={"center"} />  
                    <Table.Column key={'planoConta'}
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
                        align={"left"} />                          
                                                                     
                </Table>
            </Card>
        )
    }

    getExtra = (length) => {
        return length && length > 0 ? this.getDownloadExcel() : null
    }

    getDownloadExcel = () => {
        const { tipoTela } = this.props

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
                <Column label={`Valor ${isEqual(tipoTela, 'PAGAS') ? 'pago': 'recebido'}`} value={row => row.valorPago } />
            </Sheet>
        </Workbook>)
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioPagasRecebidas.data,
        fetching: state.relatorioPagasRecebidas.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //cleanMessage: () => dispatch(Action.relatorioPagasRecebidasCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)