import React, { Component } from 'react'
import { Card, Table, Icon, Divider, Button, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { INSERTING, EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import MenuActions from '../redux'
import { getTitle , getTagSimNao } from '../../../util/helper'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='menu.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='menu'>
                            <Column label='Nome' value={({ nome }) => nome} />
                            <Column label='Módulo' value={({ modulo }) => modulo.nome } />                            
                        </Sheet>
                    </Workbook>
                    <Divider type="vertical" />                
                    <Button type={ "primary"} 
                            //disabled = {!hasAnyAuthority("MENU_INSERIR")}
                            onClick={this.prepareInsert}>
                            NOVO
                    </Button>
                </div>
            )
        } else {
            return (
                <Button type={ "primary"} 
                    //disabled = {!hasAnyAuthority("MENU_INSERIR")}
                    onClick={this.prepareInsert}>
                    NOVO
                </Button>
            )
        }
    }

    prepareUpdate = (menu) => {
        const { setState, setMenu} = this.props
        setState(EDITING)
        setMenu(menu)
    }

    prepareInsert = () => {
        const { setState, setMenu } = this.props
        setState(INSERTING)
        setMenu(null)
    }

    render() {
        const { list = []  } = this.props

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
                        <Table.Column key={'modulo'} 
                                      dataIndex={'modulo.nome'} 
                                      title={<center>Módulo</center>} 
                                      align={ "center" }/>
                        <Table.Column key={'nivel'} 
                                      dataIndex={'nivel'} 
                                      title={<center>Nível</center>} 
                                      align={ "center" }/>
                        <Table.Column key={'ordem'} 
                                      dataIndex={'ordem'} 
                                      title={<center>Ordem</center>} 
                                      align={ "center" }/>                                      
                        <Table.Column key={'IconType'} 
                                      dataIndex={'iconType'} 
                                      title={<center>Icon Type</center>} 
                                      align={ "center" }/>
                        <Table.Column key={'link'} 
                                      dataIndex={'link'} 
                                      title={<center>Link</center>} 
                                      align={ "center" }/>
                        <Table.Column key={'dataInclusao'} 
                                      dataIndex={'dataInclusao'} 
                                      title={<center>Data inclusão</center>} 
                                      align={ "center" }
                                      render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}/>    
                        <Table.Column key={'ativo'}
                                      dataIndex={'ativo'}
                                      render={(text) => getTagSimNao(text, false)}
                                      title={<center>Ativo</center>}
                                      align={"center"} />                                      
                        <Table.Column key={'acoes'} 
                                      dataIndex={'acoes'} 
                                      title={<center>Ações</center>} 
                                      align={ "center" }
                                      width={'7%'}
                                      render={(text, record) => (
                                        <span>
                                            {//hasAnyAuthority("MENU_ALTERAR") &&
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
        ...state.menu.data,
        fetching: state.menu.fetching,
        state: state.menu.state,
        menu: state.menu.menu
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(MenuActions.menuSetState(state)),
    setMenu: (menu) => dispatch(MenuActions.menuSetMenu(menu)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)