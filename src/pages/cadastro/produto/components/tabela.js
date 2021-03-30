import React, { Component } from 'react'
import { Card, Table , Icon, Divider, Tooltip, Button } from 'antd'
import { EDITING } from '../../../util/state'
import { connect } from 'react-redux'
import Actions from '../redux'
import Pagination from '../../../util/Pagination'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { getTitle } from '../../../util/helper'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Workbook from 'react-excel-workbook'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class Tabela extends Component {
    
    getExtra = (length) => {
        if (length && length > 0) {
            return (
                <div>
                    <Workbook filename='produtos.xlsx'
                        element={
                            <Tooltip title='Click para baixar os registros.' placement='left'>
                                <Button type='primary' shape='circle' size='small' icon='download' />
                            </Tooltip>
                        }>
                        <Sheet data={this.props.list || []} name='produtos'>
                            <Column label='Nome' value={row => row.nome ?  row.nome : '' } />
                            <Column label='Valor' value={row => row.valorVenda ? row.valorVenda : ''} />
                        </Sheet>
                    </Workbook>
                </div>)
        } 
    }
   
    prepareUpdate = (produto) => {
        this.props.setStateView(EDITING)
        this.props.setProduto(produto)
    }

    getAcoes = (record) => {
        return (
            <div>
                {hasAnyAuthority("PRODUTOS_ALTERAR") && 
                <>
                <Tooltip title="Editar produto">
                    <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon>
                </Tooltip>
                <Divider type="vertical"/>
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
                    <Table.Column key={'nome'} 
                                    dataIndex={'nome'} 
                                    title={'Nome'} 
                                    align={ "left" }/>
                    <Table.Column key={'tipoProdutoEnum'} 
                                    dataIndex={'tipoProdutoEnum'} 
                                    title={'Tipo Produto'} 
                                    align={ "left" }
                                    render={ (text, record) => text}/>
                    <Table.Column key={'valorVendaUnidade'} 
                                    dataIndex={'valorVendaUnidade'} 
                                    title={'Valor Venda Unidade'} 
                                    align={ "left" }/>
                    <Table.Column key={'valorVendaCaixa'} 
                                    dataIndex={'valorVendaCaixa'} 
                                    title={'Valor Venda Caixa'} 
                                    align={ "left" }/> 
                    <Table.Column key={'qtdEstoqueUnidade'} 
                                    dataIndex={'qtdEstoqueUnidade'} 
                                    title={'Quantidade Estoque Unidade'} 
                                    align={ "left" }/> 
                    <Table.Column key={'qtdEstoqueCaixa'} 
                                    dataIndex={'qtdEstoqueCaixa'} 
                                    title={'Quantidade Estoque Caixa'} 
                                    align={ "left" }/> 
                    <Table.Column key={'acoes'} 
                                    dataIndex={'acoes'} 
                                    title={'Ações'} 
                                    align={ "center" }
                                    width={'7%'}
                                    render={(text, record) =>  this.getAcoes(record) }
                                    />
                </Table>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.produto.data,
        fetching: state.produto.fetching,
        stateView: state.produto.stateView,
        produto: state.produto.visita
    }
}

const mapDispatchToProps = (dispatch) => ({
    remover: (id) => dispatch(Actions.produtoRemover(id)),
    setStateView: (stateView) => dispatch(Actions.produtoSetStateView(stateView)),
    setProduto: (produto) => dispatch(Actions.produtoSetProduto(produto)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tabela)