import React, { Component } from 'react'
import { Card, Table, Icon, Divider, Button, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { getTitle } from '../../../util/helper'
import Actions from '../redux'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='cargo.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='cargo'>
                            <Column label='Nome' value={({ nome }) => nome} />
                        </Sheet>
                    </Workbook>                    
                </div>
            )
        }
    }

    prepareUpdate = (cargo) => {
        this.props.setStateView(EDITING)
        this.props.setCargo(cargo)
    }

    render() {
        const { list= [] } = this.props
        return (
                <Card title={getTitle("Listagem")} extra={ this.getExtra(list.length)}>
                    <Table rowKey={ (row) => row.id} 
                           dataSource={list} 
                           size={"middle"}
                           pagination={Pagination()}>
                        <Table.Column key={'nome'} 
                                      dataIndex={'nome'} 
                                      title={<center>Nome</center>} 
                                      align={ "left" }/>                        
                        <Table.Column key={'dataInclusao'} 
                                      dataIndex={'dataInclusao'} 
                                      title={<center>Data inclusão</center>} 
                                      align={ "center" }
                                      render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}/>                                      
                        <Table.Column key={'acoes'} 
                                      dataIndex={'acoes'} 
                                      title={<center>Ações</center>} 
                                      align={ "center" }
                                      width={'7%'}
                                      render={(text, record) => (
                                        <span>
                                            {hasAnyAuthority("CARGOS_ALTERAR") &&
                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon>
                                            }
                                        </span>
                                        )}/>
                    </Table>
                </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.cargo.data,
        fetching: state.cargo.fetching,
        stateView: state.cargo.stateView,
        cargo: state.cargo.cargo
    }
}

const mapDispatchToProps = (dispatch) => ({
    setStateView: (stateView) => dispatch(Actions.cargoSetStateView(stateView)),
    setCargo: (cargo) => dispatch(Actions.cargoSetCargo(cargo)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)