import React, { Component } from 'react'
import { Card, Table, Icon, Button, Divider, Tooltip } from 'antd'
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
                    <Workbook filename='usuario.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='usuario'>
                            <Column label='Nome' value={({ nome }) => nome} />
                            <Column label='Perfil' value={({ perfil }) => perfil.nome } />                            
                        </Sheet>
                    </Workbook>
                </div>
            )    
        }
    }

    prepareUpdate = (usuario) => {
        const { setState, setUsuario, setCheckedKeys, setUnidadeIds} = this.props
        setState(EDITING)
        setUsuario(usuario)
        setCheckedKeys(usuario.permissoes),
        setUnidadeIds(usuario.unidadeIds)
    }

    render() {
        const { list= [] } = this.props

        return (
            list.length > 0 &&
            <Card title={getTitle("Listagem")} extra={ this.getExtra(list.length)}>
                <Table rowKey={ (row) => row.id} 
                        dataSource={list} 
                        size={"middle"}
                        pagination={Pagination()}>
                    <Table.Column key={'nome'} 
                                    dataIndex={'nome'} 
                                    title={<center>Nome</center>} 
                                    align={ "left" }/>
                    <Table.Column key={'login'} 
                                    dataIndex={'login'} 
                                    title={<center>Login</center>} 
                                    align={ "left" }/>                                      
                    <Table.Column key={'perfil.nome'} 
                                    dataIndex={'perfil.nome'} 
                                    title={<center>Perfil</center>} 
                                    align={ "left" }/>
                    <Table.Column key={'unidade.abreviacao'} 
                                    dataIndex={'unidade.abreviacao'} 
                                    title={<center>Unidade</center>} 
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
                                        {//hasAnyAuthority("USUARIO_ALTERAR") &&
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
        ...state.usuario.data,
        fetching: state.usuario.fetching,
        state: state.usuario.state,
        usuario: state.usuario.usuario
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(Actions.usuarioSetState(state)),
    setUsuario: (usuario) => dispatch(Actions.usuarioSetUsuario(usuario)),
    setCheckedKeys: (checkedKeys) => dispatch(Actions.usuarioSetCheckedKeys(checkedKeys)),
    setUnidadeIds: (unidadeIds) => dispatch(Actions.usuarioSetUnidadeIds(unidadeIds)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)