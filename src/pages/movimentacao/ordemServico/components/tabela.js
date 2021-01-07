import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button, Modal } from 'antd'
import { EDITING, VIEWING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import Pagination from '../../../util/Pagination'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { getTitle } from '../../../util/helper'
import { hasAnyAuthority, getUser } from '../../../../services/authenticationService'
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
   
    setModo = (ordemServico, stateView) => {
        this.props.setStateView(stateView)
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
        console.log(getUser())
        const { funcionario = {}} = getUser()
        const { id: idFuncionario } = funcionario || {}

        return (
            <div>
                {
                <>
                    {hasAnyAuthority("VENDAS_ALTERAR") && (
                    // Se for o vendedor que fez ou se estiver em 'A'
                    (record.funcionario.id == idFuncionario &&  record.statusNota == 'A') || // Só perfil vendedor
                    // Se for o vendedor que fez ou se estiver em 'R'
                    (record.funcionario.id == idFuncionario && record.statusNota == 'R' ) || 
                    // Se tiver permissão para 'REABRIR', sinal que é da LOGÍSTICA
                    (record.statusNota == 'L' && hasAnyAuthority("VENDAS_-_REABRIR_ALTERAR")) ) &&
                    <Tooltip title="Editar Pedido">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'edit' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.setModo(record, EDITING)}></Icon>
                    </Tooltip>
                    }
                    {
                    record.funcionario.id == idFuncionario && record.statusNota == 'A' && hasAnyAuthority("VENDAS_-_LOGISTICA_ALTERAR") &&
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Logística">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'check' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.alterarStatusTabela(record, 'L', 'LÓGISTICA')}></Icon>
                    </Tooltip>
                    </>
                    }
                    {
                    record.statusNota == 'L' && hasAnyAuthority("VENDAS_-_REABRIR_ALTERAR") && //LÓGISTICA
                    // record.statusNota == 'N'  //CONCLUÍDA
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Reabrir Pedido">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'redo' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.alterarStatusTabela(record, 'R', 'REABRIR')}></Icon>
                    </Tooltip>
                    </>
                    }                    
                    {
                    record.statusNota == 'R' && hasAnyAuthority("VENDAS_-_REABRIR_ALTERAR") && // REABERTA
                    // record.statusNota != 'C' && record.formaGerada == false &&
                    // hasAnyAuthority("VENDAS_-_APROVAR_ALTERAR") && //CONCLUÍDA
                    <>                
                    <Divider type="vertical"/>
                    <Tooltip title="Fechar. Serar gerada as formas de pagamento do financeiro!">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'check-circle' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.alterarStatusTabela(record, 'F', 'FECHAR')}></Icon>
                    </Tooltip>
                    </>
                    }  
                    { 
                    record.statusNota == 'F' && hasAnyAuthority("VENDAS_-_LIBERAR_ALTERAR") && 
                    // record.statusNota != 'C' && record.estoqueGerado == false &&
                    // hasAnyAuthority("VENDAS_-_LIBERAR_ALTERAR") && //APROVADA
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Liberar mercadoria">
                        <Icon style={{cursor: 'pointer'}} 
                            className={'tabela-icone'}
                            type={ 'car' } onClick={(e) => this.alterarStatusTabela(record, 'T', 'LIBERAR')}></Icon>
                    </Tooltip>
                    </>
                    }
                    {
                        record.statusNota == 'T' && //record.estoqueGerado == true && 
                        hasAnyAuthority("VENDAS_-_ENTREGAR_ALTERAR") && //LIBERADA
                        <>
                        <Divider type="vertical"/>
                        <Tooltip title="Entregar mercadoria">
                            <Icon style={{cursor: 'pointer'}} 
                                className={'tabela-icone'}
                                type={ 'audit' } onClick={(e) => this.alterarStatusTabela(record, 'E', 'ENTREGAR')}></Icon>
                        </Tooltip>
                        </>
                    }                     
                    {
                    // CONCLUÍDA(N) APROVADA(O) PAGA(P) LIBERADA (L)
                    //(record.statusNota == 'N' || record.statusNota == 'O'
                    // || record.statusNota == 'P' || record.statusNota == 'L'
                    // Cancela caso esteja diferente de LIBERADA e ENTREGUE
                    record.statusNota != 'C' && 
                    hasAnyAuthority("VENDAS_-_CANCELAR_ALTERAR") &&
                    <>                
                    <Divider type="vertical"/>
                    <Tooltip title="Cancelar Pedido">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'close-circle' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.alterarStatusTabela(record, 'C', 'CANCELAR')}></Icon>
                    </Tooltip>                                
                    </>
                    }  
                    <Divider type="vertical"/>
                    <Tooltip title="Visualizar">
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'zoom-in' } 
                            onClick={(e) => this.setModo(record, VIEWING)} />
                    </Tooltip>               
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
                                    title={'Vendedor'} 
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