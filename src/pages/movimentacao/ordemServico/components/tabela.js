import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button, Modal, Popover, Badge  } from 'antd'
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
        this.props.setKitProdutoList([])
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
    
    gerarFinanceiro = (ordemServico) => {
        const { confirm } = Modal;
        const { gerarFinanceiro } = this.props;

        confirm({
            title: `Tem certeza que deseja gerar financeiro?`,
            content: 'GERAR FINANCEIRO!',
            onOk() {
                gerarFinanceiro(ordemServico.id)
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }  

    deletarFinanceiro = (ordemServico) => {
        const { confirm } = Modal;
        const { deletarFinanceiro } = this.props;

        confirm({
            title: `Tem certeza que deseja deletar financeiro?`,
            content: 'DELETAR FINANCEIRO!',
            onOk() {
                deletarFinanceiro(ordemServico.id)
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }      
    
    imprimirEvent = (ordemServico) => {
        // this.props.setStateView(stateView)
        // this.props.setOrdemServico(ordemServico)
        // this.props.setKitProdutoList(ordemServico.kitProdutoList)
    }

    getVezesLogistica = (record) => {
        const { ordemServicoStatusList = [] } = record || {}

        let statusReabertoList = ordemServicoStatusList.filter(c=> c.statusAtual == 'R')

        return (
            <div>
                <Tooltip title="Quantas vezes que foi na logística">
              {/* <Popover placement="bottom" title={"Pendências"} content={this.getPendenciasContent(pendencias)}> */}
                <Badge count={statusReabertoList.length} showZero>
                  <Icon type="redo" 
                    style={{ fontSize: '22px', color: '#08c', marginLeft: '8px' }} theme="outlined" />
                </Badge>
              {/* </Popover>                 */}
              </Tooltip>
            </div>
        )
    }    

    getAcoes = (record) => {
        //console.log(getUser())
        const { funcionario = {}, perfil = {}, } = getUser()
        const { id: idFuncionario } = funcionario || {}
        const { id: idPerfil } = perfil || {}

        return (
            <div>
                {
                <>
                    {// GERAR FINANCEIRO
                    hasAnyAuthority("VENDAS_ALTERAR") &&
                      // Se for o administrador
                    (idPerfil == 1 || idPerfil == 5) &&
                    // Só pode gerar se estiver FECHADA, TRANSPORTE, ENTREGUE
                    (record.statusNota == 'F' || record.statusNota == 'T' || record.statusNota == 'E') && 
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Gerar financeiro">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'dollar' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.gerarFinanceiro(record)}></Icon>
                    </Tooltip>
                    </>
                    }

                    {// DELETAR FINANCEIRO
                    hasAnyAuthority("VENDAS_ALTERAR") &&
                      // Se for o administrador
                    (idPerfil == 1 || idPerfil == 5) &&
                    // Só pode deletar se estiver FECHADA, TRANSPORTE, ENTREGUE
                    (record.statusNota == 'F' || record.statusNota == 'T' || record.statusNota == 'E' || record.statusNota == 'C') && 
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Deletar financeiro">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'stop' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.deletarFinanceiro(record)}></Icon>
                    </Tooltip>
                    </>
                    }

                    {// EDITAR PEDIDO
                    hasAnyAuthority("VENDAS_ALTERAR") && (
                    // Se for o vendedor que fez ou se estiver em 'A'
                    //record.funcionario.id == idFuncionario &&  
                    (record.statusNota == 'A') || // Só perfil vendedor

                    // Se for o administrador
                    (idPerfil == 1 || idPerfil == 5) ||

                    // Se for o vendedor que fez ou se estiver em 'R'                    
                    //record.funcionario.id == idFuncionario && 
                    (record.statusNota == 'R' ) || 

                    // Se tiver permissão para 'REABRIR', sinal que é da LOGÍSTICA
                    (record.statusNota == 'L' && hasAnyAuthority("VENDAS_-_REABRIR_ALTERAR")) ) &&
                    <Tooltip title="Editar Pedido">
                        <Icon style={{cursor: 'pointer'}} 
                            type={ 'edit' } 
                            className={'tabela-icone'}
                            onClick={(e) => this.setModo(record, EDITING)}></Icon>
                    </Tooltip>
                    }

                    {// ENVIAR PARA LOGÍSTICA
                    //record.funcionario.id == idFuncionario && 
                    record.statusNota == 'A' && hasAnyAuthority("VENDAS_-_LOGISTICA_ALTERAR") &&
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

                    {// REABRIR PEDIDO
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

                    {// FECHAR PEDIDO
                    record.statusNota == 'R' && hasAnyAuthority("VENDAS_-_FECHAR_ALTERAR") && // REABERTA
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

                    {// LIBERAR PEDIDO
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

                    {// ENTREGAR PEDIDO
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

                    {// CANCELAR PEDIDO
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
                    <Divider type="vertical"/>
                    <Tooltip title="Imprimir Naturais e Encapsulados">
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'printer' } 
                            onClick={(e) => this.props.imprimir({ ...record, tipoRelatorio: "N" })}
                            />
                    </Tooltip>  
                    <Divider type="vertical"/>
                    <Tooltip title="Imprimir Cosméticos">
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'printer' } 
                            onClick={(e) => this.props.imprimir({ ...record, tipoRelatorio: "C" })}
                            />
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
                                    //width={'8%'}
                                    />   
                    <Table.Column key={'dataVenda'} 
                                    dataIndex={'dataVenda'} 
                                    title={'Data venda'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    //width={'10%'}
                                    />
                    <Table.Column key={'dataPrevisaoEntrega'} 
                                    dataIndex={'dataPrevisaoEntrega'} 
                                    title={'Data Previsão Entrega'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    //width={'10%'}
                                    />
                    <Table.Column key={'dataLiberacao'} 
                                    dataIndex={'dataLiberacao'} 
                                    title={'Data liberação'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    //width={'10%'}
                                    />
                    <Table.Column key={'dataEntrega'} 
                                    dataIndex={'dataEntrega'} 
                                    title={'Data entrega'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    //width={'10%'}
                                    />                                                                                                            
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
                    <Table.Column key={'nfMeldica'} 
                                    dataIndex={'nfMeldica'} 
                                    title={'NF Méldica'} 
                                    align={ "left" }
                                    //width={'8%'}
                                    />
                    <Table.Column key={'nfCosmetico'} 
                                    dataIndex={'nfCosmetico'} 
                                    title={'NF Cosmético'} 
                                    align={ "left" }
                                    //width={'8%'}
                                    />                                                                          
                    <Table.Column key={'logistica'} 
                                    dataIndex={'logistica'} 
                                    title={'Logís.'} 
                                    align={ "center" }
                                    width={'5%'}
                                    render={(text, record) => this.getVezesLogistica(record) }
                                    />                                    
                    <Table.Column key={'acoes'} 
                                    dataIndex={'acoes'} 
                                    title={'Ações'} 
                                    align={ "center" }
                                    width={'15%'}
                                    render={(text, record) => this.getAcoes(record) }
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
    setKitProdutoList: (kitProdutoList) => dispatch(Actions.ordemServicoSetKitProdutoList(kitProdutoList)),
    imprimir: (obj) => dispatch(Actions.ordemServicoImprimir(obj)),
    gerarFinanceiro: (id) => dispatch(Actions.ordemServicoGerarFinanceiro(id)),
    deletarFinanceiro: (id) => dispatch(Actions.ordemServicoDeletarFinanceiro(id)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)