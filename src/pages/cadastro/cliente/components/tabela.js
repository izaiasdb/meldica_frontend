import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button } from 'antd'
import { EDITING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import Pagination from '../../../util/Pagination'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Workbook from 'react-excel-workbook'
import { isNil } from 'lodash'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='clientes.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='clientes'>
                            <Column label='Nome' value={row => row.nome ?  row.nome : '' } />
                            {/* <Column label='Valor' value={row => row.valorVenda ? row.valorVenda : ''} /> */}
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (cliente) => {
        this.props.setStateView(EDITING)
        this.props.setCliente(cliente)
    }

    cancelar = (cliente) => {
        this.props.cancelar(cliente)
    }

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("CLIENTES_ALTERAR") && 
                <>
                <Tooltip title="Editar cliente">
                    <Icon style={{cursor: 'pointer'}} type={ 'edit' } className={'tabela-icone'} onClick={(e) => this.prepareUpdate(record)}></Icon>
                </Tooltip>
                <Divider type="vertical"/>

                </>
                }
                {hasAnyAuthority("CLIENTES_EXCLUIR") &&
                <Tooltip title="Cancelar">
                    <Icon style={{cursor: 'pointer'}} type={ 'close-circle' } className={'tabela-icone'} onClick={(e) => this.cancelar(record)}></Icon>
                </Tooltip>}
            </div> 
        )       
    }

    render() {
        const { list = [] , remover } = this.props

        const expandedRowRender = (record, index, indent, expanded) => {
            const { clienteEnderecoList } = record

            if (!isNil(clienteEnderecoList) && clienteEnderecoList.length > 0) {
                return (
                    <Table dataSource={clienteEnderecoList}
                        rowKey={(row) => row.id}
                        pagination={false}>
                        <Table.Column title={<center>Estado</center>} key={"uf"} dataIndex={"uf"} align={"center"} />
                        <Table.Column title={<center>Cidade</center>} key={"cidade"} dataIndex={"cidade"} align={"center"} />
                    
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
            list.length > 0 &&
            <Card title={ getTitle("Listagem") } extra={ this.getExtra(list.length)} >
                <Table rowKey={ (row) => row.id} 
                        dataSource={list} 
                        size={"middle"}
                        expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) }
                        pagination={Pagination()}>                        
                    <Table.Column key={'nome'} 
                                    dataIndex={'nome'} 
                                    title={'Nome'} 
                                    align={ "left" }/>
                    <Table.Column key={'cpfCnpj'} 
                                    dataIndex={'cpfCnpj'} 
                                    title={'Cpf / Cnpj'} 
                                    align={ "left" }/>                                    
                    <Table.Column key={'acoes'} 
                                    dataIndex={'acoes'} 
                                    title={'A????es'} 
                                    align={ "center" }
                                    width={'7%'}
                                    render={(text, record) =>  this.getAcoes(record) }
                                    />
                </Table>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.cliente.data,
        fetching: state.cliente.fetching,
        stateView: state.cliente.stateView,
        cliente: state.cliente.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    cancelar: (cancelar) => dispatch(Actions.clienteCancelar(cancelar)),
    setStateView: (stateView) => dispatch(Actions.clienteSetStateView(stateView)),
    setCliente: (cliente) => dispatch(Actions.clienteSetCliente(cliente)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)