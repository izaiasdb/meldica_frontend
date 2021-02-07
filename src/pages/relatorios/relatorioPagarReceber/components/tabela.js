import React, { Component } from 'react'
import { Card, Table, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import Workbook from 'react-excel-workbook'
import moment from 'moment'

import Action from '../redux'
import Pagination from '../../../util/Pagination'
import { getTitleTable } from '../../../util/helper'


const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {

    render() {
        const { list = [], tipoTela } = this.props

        return (
            <Card extra={this.getExtra(list.length)}
                bordered={false} >
                <Table 
                    title={() => getTitleTable(`RELATÓRIO DEC CONTAS À ${tipoTela}`) }
                    rowKey={(row) => row.numeroConta}
                    dataSource={list} 
                    size={"middle"}
                    pagination={Pagination(50)} >
                    {/* <Table.Column key={'seq'}
                            dataIndex={'id'}
                            title={'Seq'}
                            align={"center"} /> */}
                    {/* <Table.Column key={'dataLog'}
                        dataIndex={'dataLog'}
                        title={'Data Log'}
                        render={(text) => text && moment(text).format('DD/MM/YYYY')}
                        align={"center"} width={'40%'} /> */}
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
                    <Table.Column key={'valorFalta'}
                        dataIndex={'valorFalta'}
                        title={'Valor Falta'}
                        align={"left"} />                          
                                                                     
                </Table>
            </Card>
        )
    }

    getExtra = (length) => {
        return length && length > 0 ? this.getDownloadExcel() : null
    }

    getDownloadExcel = () => {
        return (<Workbook filename='relatorio_pagar_receber.xlsx'
            element={
                <Tooltip title='Click para baixar os registros.' placement='left'>
                    <Button type='primary' shape='circle' size='small' icon='download' />
                </Tooltip>
            }>
            <Sheet data={this.props.list || []} name='relatorio_pagar_receber' >
                {/* <Column label='Data log' value={row => row.dataLog ? moment(row.dataLog).format('DD/MM/YYYY') : ''} /> */}
                {/* <Column label='Tipo de log' value={row => row.tipoTerminalLog && row.tipoTerminalLog.decricao ? row.tipoTerminalLog.decricao : ''} />                 */}
                <Column label='Número da Conta' value={row => row.numeroConta } />
                <Column label='Plano de Conta' value={row => row.planoConta } />
                <Column label='Valor' value={row => row.valor } />
                <Column label='Valor Falta' value={row => row.valorFalta } />
            </Sheet>
        </Workbook>)
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.relatorioPagarReceber.data,
        fetching: state.relatorioPagarReceber.fetching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //cleanMessage: () => dispatch(Action.relatorioPagarReceberCleanMessage()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)