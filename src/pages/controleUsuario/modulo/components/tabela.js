import React, { Component } from 'react'
import { Card, Table, Icon, Divider, Button, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { INSERTING, EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { getTitle } from '../../../util/helper'
import ModuloActions from '../redux'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='modulo.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='modulo'>
                            <Column label='Nome' value={({ nome }) => nome} />
                            <Column label='Sistema' value={({ sistema }) => sistema.nome } />                            
                        </Sheet>
                    </Workbook>
                    <Divider type="vertical" />                
                    <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("MODULO_INSERIR")}
                            onClick={this.prepareInsert}>
                            NOVO
                    </Button>
                </div>
            )
        } else {
            return (
                <Button type={ "primary"} 
                    disabled = {!hasAnyAuthority("MODULO_INSERIR")}
                    onClick={this.prepareInsert}>
                    NOVO
                </Button>
            )
        }
    }

    prepareUpdate = (modulo) => {
        const { setState, setModulo} = this.props
        setState(EDITING)
        setModulo(modulo)
    }

    prepareInsert = () => {
        const { setState, setModulo } = this.props
        setState(INSERTING)
        setModulo(null)
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
                                            {hasAnyAuthority("MODULO_ALTERAR") &&
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
        ...state.modulo.data,
        fetching: state.modulo.fetching,
        state: state.modulo.state,
        modulo: state.modulo.modulo
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(ModuloActions.moduloSetState(state)),
    setModulo: (modulo) => dispatch(ModuloActions.moduloSetModulo(modulo)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)