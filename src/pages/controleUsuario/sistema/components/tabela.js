import React, { Component } from 'react'
import { Card, Table, Icon, Button, Divider, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { INSERTING, EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import SistemaActions from '../redux'
import { getTitle } from '../../../util/helper'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='sistema.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='sistema'>
                            <Column label='Nome' value={({ nome }) => nome} />
                            <Column label='Abreviado' value={({ abreviado }) => abreviado} />                            
                        </Sheet>
                    </Workbook>
                    <Divider type="vertical" />                
                    <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("SISTEMA_INSERIR")}
                            onClick={this.prepareInsert}>
                            NOVO
                    </Button>
                </div>
            )
        } else {
            return (
                <Button type={ "primary"} 
                    disabled = {!hasAnyAuthority("SISTEMA_INSERIR")}
                    onClick={this.prepareInsert}>
                    NOVO
                </Button>
            )
        }
    }

    prepareUpdate = (sistema) => {
        const { setState, setSistema} = this.props
        setState(EDITING)
        setSistema(sistema)
    }

    prepareInsert = () => {
        const { setState, setSistema } = this.props
        setState(INSERTING)
        setSistema(null)
    }

    render() {
        const { list = []  } = this.props
        return (
                <Card title={getTitle("Listagem")} extra={ this.getExtra(list.length)}>
                {/* <Card extra={ this.getExtra()}> */}
                    <Table rowKey={ (row) => row.id} 
                           dataSource={list} 
                           size={"middle"}
                           pagination={Pagination()}>
                        <Table.Column key={'nome'} 
                                      dataIndex={'nome'} 
                                      title={<center>Nome</center>} 
                                      align={ "left" }/>                        
                        <Table.Column key={'abreviado'} 
                                      dataIndex={'abreviado'} 
                                      title={<center>Abreviado</center>} 
                                      align={ "center" }/>
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
                                            {hasAnyAuthority("SISTEMA_ALTERAR") &&
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
        ...state.sistema.data,
        fetching: state.sistema.fetching,
        state: state.sistema.state,
        sistema: state.sistema.sistema
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(SistemaActions.sistemaSetState(state)),
    setSistema: (sistema) => dispatch(SistemaActions.sistemaSetSistema(sistema)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)