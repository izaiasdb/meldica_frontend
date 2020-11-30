import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button, Modal } from 'antd'
import { EDITING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import Pagination from '../../../util/Pagination'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Workbook from 'react-excel-workbook'
import { openNotification } from '../../../util/notification'
import { isEqual, isEmpty, get } from 'lodash'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {

    /*
    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                this.props.cleanTable()
            }

            this.props.cleanMessage()
        }
    }  */  
    
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

    alterarStatusTabela = (ordemServico, statusNota, titulo) => {
        const { confirm } = Modal;
        const { alterarStatus } = this.props;

        confirm({
            title: `Tem certeza que deseja ${titulo}?`,
            content: 'Processo não pode ser DESFEITO!',
            onOk() {
                alterarStatus({...ordemServico, statusNota: statusNota})
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }    

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("VENDAS_ALTERAR") && 
                <>
                    {record.statusNota == 'A' &&
                    <Tooltip title="Editar Ordem Servico">
                        <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon>
                    </Tooltip>
                    }
                    {record.statusNota == 'A' &&
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Concluir Ordem Serviço">
                        <Icon style={{cursor: 'pointer'}} type={ 'right-circle' } onClick={(e) => this.alterarStatusTabela(record, 'N', 'CONCLUIR')}></Icon>
                    </Tooltip>
                    </>
                    }
                    {record.statusNota == 'N' &&
                    <>                
                    <Divider type="vertical"/>
                    <Tooltip title="Aprovar Ordem Serviço">
                        <Icon style={{cursor: 'pointer'}} type={ 'check-circle' } onClick={(e) => this.alterarStatusTabela(record, 'O', 'APROVAR')}></Icon>
                    </Tooltip>
                    </>
                    }  
                    {record.statusNota == 'N' &&
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Reabrir Ordem Serviço">
                        <Icon style={{cursor: 'pointer'}} type={ 'left-circle' } onClick={(e) => this.alterarStatusTabela(record, 'A', 'REABRIR')}></Icon>
                    </Tooltip>
                    </>
                    }
                    {(record.statusNota == 'N' || record.statusNota == 'O' || record.statusNota == 'P') &&
                    <>                
                    <Divider type="vertical"/>
                    <Tooltip title="Cancelar Ordem Serviço">
                        <Icon style={{cursor: 'pointer'}} type={ 'close-circle' } onClick={(e) => this.alterarStatusTabela(record, 'C', 'CANCELAR')}></Icon>
                    </Tooltip>                                
                    </>
                    }                
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
                    <Table.Column key={'id'} 
                                    dataIndex={'id'} 
                                    title={'Número'} 
                                    align={ "left" }
                                    width={'8%'}/>   
                    <Table.Column key={'dataVenda'} 
                                    dataIndex={'dataVenda'} 
                                    title={'Data venda'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    width={'10%'}/>
                    <Table.Column key={'statusNovaDescricao'} 
                                    dataIndex={'statusNovaDescricao'} 
                                    title={'Status Nota'} 
                                    align={ "left" }/>
                    <Table.Column key={'cliente.nome'} 
                                    dataIndex={'cliente.nome'} 
                                    title={'Cliente'} 
                                    align={ "left" }/>
                    <Table.Column key={'funcionario.nome'} 
                                    dataIndex={'funcionario.nome'} 
                                    title={'Funcionário'} 
                                    align={ "left" }/>                                    
                    <Table.Column key={'acoes'} 
                                    dataIndex={'acoes'} 
                                    title={'Ações'} 
                                    align={ "center" }
                                    width={'15%'}
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
    alterarStatus: (obj) => dispatch(Actions.ordemServicoAlterarStatus(obj)),    
    cleanMessage: ()  => dispatch(Actions.ordemServicoCleanMessage()),
    cleanTable: () => dispatch(Actions.ordemServicoCleanTable()),    
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)