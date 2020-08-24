import React, { Component } from 'react'
import { Card, Table, Icon, Button, Divider, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { getTitle } from '../../../util/helper'
import PerfilActions from '../redux'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='perfil.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='perfil'>
                            <Column label='Nome' value={({ nome }) => nome} />
                        </Sheet>
                    </Workbook>
                    {/* <Divider type="vertical" />                
                    <Button type={ "primary"} 
                            disabled = {!hasAnyAuthority("PERFIL_INSERIR")}
                            onClick={this.prepareInsert}>
                            NOVO
                    </Button> */}
                </div>
            )
        } else {
            // return (
            //     <Button type={ "primary"} 
            //         disabled = {!hasAnyAuthority("PERFIL_INSERIR")}
            //         onClick={this.prepareInsert}>
            //         NOVO
            //     </Button>
            // )
        }
    }

    prepareUpdate = (perfil) => {
        const { setState, setPerfil, setCheckedKeys} = this.props
        setState(EDITING)
        setPerfil(perfil)
        setCheckedKeys(perfil.permissoes)
    }

    // prepareInsert = () => {
    //     const { setState, setPerfil } = this.props
    //     setState(INSERTING)
    //     setPerfil(null)
    // }

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
                                        {hasAnyAuthority("PERFIL_ALTERAR") &&
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
        ...state.perfil.data,
        fetching: state.perfil.fetching,
        state: state.perfil.state,
        perfil: state.perfil.perfil
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(PerfilActions.perfilSetState(state)),
    setPerfil: (perfil) => dispatch(PerfilActions.perfilSetPerfil(perfil)),
    setCheckedKeys: (checkedKeys) => dispatch(PerfilActions.perfilSetCheckedKeys(checkedKeys)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)