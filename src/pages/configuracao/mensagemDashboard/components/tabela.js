import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Icon, Popconfirm , Divider } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { EDITING } from '../../../util/state'
import MensagemDashboardActions from '../redux'
import Pagination from '../../../util/Pagination'
import Workbook from 'react-excel-workbook'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import { getTitleTable , getTagSimNao } from '../../../util/helper'
import { isNil } from 'lodash'

class Tabela extends Component {

    prepareUpdate = (obj) => {
        this.props.setState(EDITING)
        this.props.setMensagemDashboard(obj)
    }

    handleDelete = (obj) => {
        obj = {...obj, ativo: 0}
        this.props.deletar(obj)
    }

    render() {
        const { list = [] } = this.props
        
        return (
            <Card bordered={false}
                extra={this.getExtra(list.length)} >
                <Table title={() =>  getTitleTable('LISTAGEM DE MENSAGENS DASHBOARD')} 
                    rowKey={(row) => row.sequencial}
                    dataSource={list}
                    size={"middle"}
                    pagination={Pagination()}>

                    <Table.Column key={'seq'}
                        dataIndex={'sequencial'}
                        title={'Seq'}
                        align={"center"} />         
                    <Table.Column key={'unidade'} 
                        dataIndex={'unidade.abreviacao'} 
                        title={'Unidade'} 
                        align={ "left" }/>    
                    <Table.Column key={'titulo'}
                        dataIndex={'titulo'}
                        title={'Título'}
                        align={"left"} />
                    <Table.Column key={'dataInicio'}
                        dataIndex={'dataInicio'}
                        title={'Data inicial'}
                        align={"center"}
                        render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')} />
                    <Table.Column key={'dataFim'}
                        dataIndex={'dataFim'}
                        title={'Data final'}
                        align={"center"}
                        render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')} />
                    <Table.Column key={'dataInclusao'}
                        dataIndex={'dataInclusao'}
                        title={'Data inclusão'}
                        align={"center"}
                        render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')} /> 
                    <Table.Column key={'ativo'}
                        dataIndex={'ativo'}
                        render={(text) => getTagSimNao(text, false)}
                        title={'Ativa'}
                        align={"center"} />       
                    <Table.Column key={'acoes'}
                        dataIndex={'acoes'}
                        title={'Ações'}
                        align={"center"}
                        width={'7%'}
                        render={(text, record) => (
                            <span>
                                <span>
                                    {hasAnyAuthority("MENSAGEM_DASHBOARD_ALTERAR") &&
                                        <Tooltip title="Atualizar mensagem">
                                            <Icon style={{ cursor: 'pointer' }} type={'edit'} onClick={(e) => this.prepareUpdate(record)} />
                                        </Tooltip>
                                    }
                                </span>
                                <Divider type="vertical"/>
                                <span>
                                    {hasAnyAuthority("MENSAGEM_DASHBOARD_EXCLUIR") && 
                                        <Popconfirm title={"Você realmente gostaria de desativar esta mensagem?"}
                                            placement="topLeft" 
                                            okText={"Sim"}
                                            okType={"danger"}
                                            cancelText={"Não"}
                                            disabled={!record.ativo}
                                            onConfirm={() => this.handleDelete(record)}>
                                                <Tooltip title={"Desativar mensagem"}>
                                                    <Icon style={{ cursor: 'pointer' }} type="delete" />
                                                </Tooltip>
                                        </Popconfirm>
                                    }
                                </span>     
                            </span>
                        )} />
                </Table>
            </Card>
        )
    }

    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='mensagem_dashboard.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Workbook.Sheet data={this.props.list || []} name='mensagem_dashboard'>
                            <Workbook.Column label='Título' value={ row  => (!isNil(row) && !isNil(row.titulo)) ? row.titulo : '' } />
                            <Workbook.Column label='Descrição' value={  row  =>  (!isNil(row) && !isNil(row.descricao)) ? row.descricao  : '' } />
                        </Workbook.Sheet>
                    </Workbook>
                </div>)
        } 
    }

}

const mapStateToProps = (state) => {
    return {
        ...state.mensagemDashboard.data,
        fetching: state.mensagemDashboard.fetching,
        state: state.mensagemDashboard.state,
        obj: state.mensagemDashboard.obj,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deletar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardDeletar(obj)),
    pesquisar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardPesquisar(obj)),
    setState: (state) => dispatch(MensagemDashboardActions.mensagemDashboardSetState(state)),
    setMensagemDashboard: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardSetMensagemDashboard(obj)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)