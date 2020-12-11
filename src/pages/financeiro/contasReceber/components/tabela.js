import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button, Modal } from 'antd'
import { EDITING, VIEWING } from '../../../util/state'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillAlt, faHandHoldingUsd, faDollarSign } from '@fortawesome/free-solid-svg-icons' //user-md -> faUserMd

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {

    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='contasRecebers.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='contasRecebers'>
                            {/* <Column label='Nome' value={row => row.nome ?  row.nome : '' } /> */}
                            <Column label='Valor' value={row => row.valor ? row.valor : ''} />
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (contasReceber) => {
        this.props.setStateView(EDITING)
        this.props.setContasReceber(contasReceber)
    }

    setModo = (contasReceber, modo) => {
        this.props.setStateView(modo)
        this.props.setContasReceber(contasReceber)
    }

    pagarConta = (contasReceber) => {
        const { confirm } = Modal;
        const { contasReceberPagar } = this.props;

        confirm({
            title: `Pagar o Documento todo`,
            content: 'Tem certeza que deseja pagar o documento?',
            onOk() {
                contasReceberPagar({...contasReceber})
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }    

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("CONTAS_RECEBER_ALTERAR") && 
                <>
                    {record.valorPago == 0 &&
                    <Tooltip title="Editar Contas a Receber">
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'edit' } 
                            onClick={(e) => this.prepareUpdate(record)}></Icon>
                    </Tooltip>
                    }                  
                    {record.valor > record.valorPago  &&
                    <>
                    <Divider type="vertical"/>
                    <Tooltip title="Pagar parte do documento">
                        {/* <FontAwesomeIcon 
                            icon={faDollarSign} 
                        }} /> */}
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'plus' } 
                            onClick={(e) => this.setModo(record, 'PAGAR')} />
                    </Tooltip> 
                    <Divider type="vertical"/>
                    <Tooltip title="Pagar total ou restante do documento">
                        {/* <FontAwesomeIcon 
                            icon={faHandHoldingUsd} 
                            //style={{ marginRight: '20px', fontSize: '22px', color: '#08c' }} 
                        }} /> */}
                        <Icon 
                            className={'tabela-icone'}
                            type={ 'check-circle' } 
                            onClick={(e) => this.pagarConta(record)} />
                    </Tooltip>
                    </>
                    }
                    <Divider type="vertical"/>
                    <Tooltip title="Visualizar documento">
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
                    <Table.Column key={'dataVencimento'} 
                                    dataIndex={'dataVencimento'} 
                                    title={'Data Vencimento'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    width={'10%'}/>
                    <Table.Column key={'competencia'} 
                                    dataIndex={'competencia'} 
                                    title={'Competência'} 
                                    align={ "left" }/>                                    
                    <Table.Column key={'cliente.nome'} 
                                    dataIndex={'cliente.nome'} 
                                    title={'Cliente'} 
                                    align={ "left" }/>
                    <Table.Column key={'planoConta.nome'} 
                                    dataIndex={'planoConta.nome'} 
                                    title={'Plano de Conta'} 
                                    align={ "left" }/>                                    
                    <Table.Column key={'documento'} 
                                    dataIndex={'documento'} 
                                    title={'Documento'} 
                                    align={ "left" }/>    
                    <Table.Column key={'valor'} 
                                    dataIndex={'valor'} 
                                    title={'Valor'} 
                                    align={ "left" }/>   
                    <Table.Column key={'valorPago'} 
                                    dataIndex={'valorPago'} 
                                    title={'Valor Pago'} 
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
        ...state.contasReceber.data,
        fetching: state.contasReceber.fetching,
        stateView: state.contasReceber.stateView,
        contasReceber: state.contasReceber.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    remover: (id) => dispatch(Actions.contasReceberRemover(id)),
    setStateView: (stateView) => dispatch(Actions.contasReceberSetStateView(stateView)),
    setContasReceber: (contasReceber) => dispatch(Actions.contasReceberSetContasReceber(contasReceber)),
    contasReceberPagar: (obj) => dispatch(Actions.contasReceberPagar(obj)),    
    cleanMessage: ()  => dispatch(Actions.contasReceberCleanMessage()),
    cleanTable: () => dispatch(Actions.contasReceberCleanTable()),    
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)