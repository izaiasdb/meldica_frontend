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

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='ordemServicos.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='ordemServicos'>
                            {/* <Column label='Nome' value={row => row.nome ?  row.nome : '' } /> */}
                            <Column label='Valor' value={row => row.valor ? row.valor : ''} />
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (ordemServico) => {
        this.props.setStateView(EDITING)
        this.props.setOrdemServico(ordemServico)
    }

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("VENDAS_ALTERAR") && 
                <>
                <Tooltip title="Editar ordemServico">
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
                    <Table.Column key={'cliente.nome'} 
                                    dataIndex={'cliente.nome'} 
                                    title={'Cliente'} 
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
        ...state.ordemServico.data,
        fetching: state.ordemServico.fetching,
        stateView: state.ordemServico.stateView,
        ordemServico: state.ordemServico.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    remover: (id) => dispatch(Actions.ordemServicoRemover(id)),
    setStateView: (stateView) => dispatch(Actions.ordemServicoSetStateView(stateView)),
    setOrdemServico: (ordemServico) => dispatch(Actions.ordemServicoSetOrdemServico(ordemServico)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)