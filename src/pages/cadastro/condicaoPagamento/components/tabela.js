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
                    <Workbook filename='condicaoPagamento.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='condicaoPagamento'>
                            <Column label='Nome' value={({ nome }) => nome} />
                        </Sheet>
                    </Workbook>
                </div>
            )
        }
    }

    prepareUpdate = (condicaoPagamento) => {
        this.props.setStateView(EDITING)
        this.props.setCondicaoPagamento(condicaoPagamento)
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
                                            {hasAnyAuthority("CONDICOES_DE_PAGAMENTO_ALTERAR") &&
                                                <Icon style={{cursor: 'pointer'}} type={ 'edit' } className={'tabela-icone'} onClick={(e) => this.prepareUpdate(record)}></Icon>
                                            }
                                            <Divider type="vertical"/>
                                            {hasAnyAuthority("CONDICOES_DE_PAGAMENTO_EXCLUIR") &&
                                            <Tooltip title="Cancelar">
                                                <Icon style={{cursor: 'pointer'}} type={ 'close-circle' } className={'tabela-icone'} onClick={(e) => this.props.cancelar(record)}></Icon>
                                            </Tooltip>      
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
        ...state.condicaoPagamento.data,
        fetching: state.condicaoPagamento.fetching,
        stateView: state.condicaoPagamento.stateView,
        condicaoPagamento: state.condicaoPagamento.condicaoPagamento
    }
}

const mapDispatchToProps = (dispatch) => ({
    cancelar: (cancelar) => dispatch(Actions.condicaoPagamentoCancelar(cancelar)),
    setStateView: (stateView) => dispatch(Actions.condicaoPagamentoSetStateView(stateView)),
    setCondicaoPagamento: (condicaoPagamento) => dispatch(Actions.condicaoPagamentoSetCondicaoPagamento(condicaoPagamento)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)