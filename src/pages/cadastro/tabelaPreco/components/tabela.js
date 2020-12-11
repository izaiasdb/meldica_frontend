import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button } from 'antd'
import { EDITING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import Pagination from '../../../util/Pagination'
import { getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Workbook from 'react-excel-workbook'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='tabelaPrecos.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='tabelaPrecos'>
                            <Column label='Nome' value={row => row.nome ?  row.nome : '' } />
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (tabelaPreco) => {
        this.props.setStateView(EDITING)
        this.props.setTabelaPreco(tabelaPreco)
    }

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("TABELA_PRECO_ALTERAR") && 
                <>
                <Tooltip title="Editar tabelaPreco">
                    <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon>
                </Tooltip>
                <Divider type="vertical"/>
                </>
                }
            </div> 
        )       
    }

    render() {
        const { list = [] , remover } = this.props
        return (
            list.length > 0 &&
            <Card title={ getTitle("Listagem") } extra={ this.getExtra(list.length)} >
                <Table rowKey={ (row) => row.id} 
                        dataSource={list} 
                        size={"middle"}
                        pagination={Pagination()}>                        
                    <Table.Column key={'nome'} 
                                    dataIndex={'nome'} 
                                    title={'Nome'} 
                                    align={ "left" }/>
                    <Table.Column key={'acoes'} 
                                    dataIndex={'acoes'} 
                                    title={'Ações'} 
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
        ...state.tabelaPreco.data,
        fetching: state.tabelaPreco.fetching,
        stateView: state.tabelaPreco.stateView,
        tabelaPreco: state.tabelaPreco.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    remover: (id) => dispatch(Actions.tabelaPrecoRemover(id)),
    setStateView: (stateView) => dispatch(Actions.tabelaPrecoSetStateView(stateView)),
    setTabelaPreco: (tabelaPreco) => dispatch(Actions.tabelaPrecoSetTabelaPreco(tabelaPreco)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)