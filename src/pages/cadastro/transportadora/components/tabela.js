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
                    <Workbook filename='transportadoras.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='transportadoras'>
                            <Column label='Nome' value={row => row.nome ?  row.nome : '' } />
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (transportadora) => {
        this.props.setStateView(EDITING)
        this.props.setTransportadora(transportadora)
    }

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("TRANSPORTADORA_ALTERAR") && 
                <>
                <Tooltip title="Editar transportadora">
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
        ...state.transportadora.data,
        fetching: state.transportadora.fetching,
        stateView: state.transportadora.stateView,
        transportadora: state.transportadora.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    remover: (id) => dispatch(Actions.transportadoraRemover(id)),
    setStateView: (stateView) => dispatch(Actions.transportadoraSetStateView(stateView)),
    setTransportadora: (transportadora) => dispatch(Actions.transportadoraSetTransportadora(transportadora)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)