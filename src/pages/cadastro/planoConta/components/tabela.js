import React, { Component } from 'react'
import { Card, Table, Icon, Divider, Button, Tooltip } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import { EDITING } from '../../../util/state'
import Pagination from '../../../util/Pagination'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Actions from '../redux'
import { getTitle , getTagSimNao } from '../../../util/helper'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='planoConta.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='planoConta'>
                            <Column label='Nome' value={({ nome }) => nome} />
                            {/* <Column label='Módulo' value={({ modulo }) => modulo.nome } />                             */}
                        </Sheet>
                    </Workbook>                  
                </div>
            )        
        }
    }

    prepareUpdate = (planoConta) => {
        const { setStateView, setPlanoConta} = this.props
        setStateView(EDITING)
        setPlanoConta(planoConta)
    }

    render() {
        const { list = []  } = this.props

        return (
                <Card title={getTitle("Listagem")} extra={ this.getExtra(list.length)}>
                    <Table rowKey={ (row) => row.id} 
                           dataSource={list} 
                           size={"middle"}
                           pagination={Pagination()}>
                        <Table.Column key={'numeroConta'} 
                                      dataIndex={'numeroConta'} 
                                      title={<center>Número Conta</center>} 
                                      align={ "left" }/>                               
                        <Table.Column key={'nome'} 
                                      dataIndex={'nome'} 
                                      title={<center>Nome</center>} 
                                      align={ "left" }/>
                        <Table.Column key={'nivel'} 
                                      dataIndex={'nivel'} 
                                      title={<center>Nível</center>} 
                                      align={ "center" }/>
                        <Table.Column key={'tipoReceitaDespesa'} 
                                      dataIndex={'tipoReceitaDespesa'} 
                                      title={<center>Receita Despesa</center>} 
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
                                            {hasAnyAuthority("PLANO_CONTA_ALTERAR") &&
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
        ...state.planoConta.data,
        fetching: state.planoConta.fetching,
        stateView: state.planoConta.stateView,
        planoConta: state.planoConta.planoConta
    }
}

const mapDispatchToProps = (dispatch) => ({
    setStateView: (stateView) => dispatch(Actions.planoContaSetStateView(stateView)),
    setPlanoConta: (planoConta) => dispatch(Actions.planoContaSetPlanoConta(planoConta)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)