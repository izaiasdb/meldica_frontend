import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'
import moment from 'moment'
import { isNil } from 'lodash';

export default class TabOrdemServico extends Component {

    render() {
        const { ordemServicoList = [] } = this.props || {}

        const expandedRowRender = (record, index, indent, expanded) => {
            const { pagarReceberList = []} = record

            if (!isNil(pagarReceberList) && pagarReceberList.length > 0) {
                return (
                    <Table dataSource={pagarReceberList}
                        rowKey={(row) => row.id}
                        pagination={false}
                        bordered>
                        <Table.Column key={'dataVencimento'} 
                                    dataIndex={'dataVencimento'} 
                                    title={'Data vencimento'} 
                                    align={ "center" }
                                    render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                                    //width={'10%'}
                                    />                              
                        <Table.Column title={<center>Competência</center>} key={"competencia"} dataIndex={"competencia"} align={"center"} />
                        <Table.Column title={<center>Documento</center>} key={"documento"} dataIndex={"documento"} align={"center"} />
                        <Table.Column title={<center>Descrição </center>} key={"descricao"} dataIndex={"descricao"} align={"center"} />
                        <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                        <Table.Column title={<center>Valor pago</center>} key={"valorPago"} dataIndex={"valorPago"} align={"center"} />
                    </Table>
                )
            } else {
                return (
                    <Table dataSource={[]}
                        pagination={false} />
                )
            }
        };
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} 
                    dataSource={ordemServicoList}
                    expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) }
                    >
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
                </Table>
            </div>
        )
    }

}
