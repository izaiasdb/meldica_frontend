import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { isNil } from 'lodash'

export default class TabDadosAfastamentoServidor extends Component {

    render() {

        const { afastamentos = [] } = this.props
                
        const expandedRowRender = (record, index, indent, expanded) => {

            const dataSourceList = [
                {
                    key: 1,
                    motivo :  !isNil(record) && !isNil(record.motivo)  ? record.motivo : '' ,
                    anoFerias : !isNil(record) && !isNil(record.anoFerias) && record.anoFerias ? record.anoFerias : '' ,
                    anoAquisicao : !isNil(record) && !isNil(record.anoAquisicao) && record.anoAquisicao ? record.anoAquisicao : '' ,
                    tercoFerias : !isNil(record) && !isNil(record.tercoFerias)  ? record.tercoFerias : '' ,
                },
            ]

            if (!isNil(record)) {
                return (
                        <Table rowKey={(row) => row.id} dataSource={dataSourceList}
                            pagination={false} >

                            <Table.Column key={'motivo'}
                                dataIndex={'motivo'}
                                title={'Motivo'}
                                align={"center"} />
                            <Table.Column key={'anoAquisicao'}
                                dataIndex={'anoAquisicao'}
                                title={'Ano Aquisição'}
                                align={"center"} />
                            <Table.Column key={'anoFerias'}
                                dataIndex={'anoFerias'}
                                title={'Ano férias'}
                                align={"center"} />
                            <Table.Column key={'tercoFerias'}
                                dataIndex={'tercoFerias'}
                                title={'Terço Férias'}
                                render={(text, record) => !isNil(text) && text == 'S' ? 'SIM' : !isNil(text) && text == 'N' ? 'NÃO' : '' }
                                align={"center"} />    
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
                    dataSource={afastamentos}
                    expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) } >

                    <Table.Column title={"Protocolo"} dataIndex={"numeroProtocolo"} align={"center"}/>
                    <Table.Column title={"Tipo Licença"} dataIndex={"tipoLicenca.descricaoLicenca"} align={"left"}/>
                    <Table.Column title={"Data Recebimento"} 
                                  dataIndex={"dataRecebimento"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column title={"Data Início"} 
                                  dataIndex={"dataInicio"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column title={"Data Fim"} 
                                  dataIndex={"dataFim"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column title={"Situação"} dataIndex={"tipoSituacao.descricaoSituacao"} align={"left"}/>
                    <Table.Column title={"Número Dias"} dataIndex={"numeroDias"} align={"center"}/>
                    <Table.Column title={"Dias Usufruídos"} dataIndex={"diasUsufruidos"} align={"center"}/>

                </Table>
            </div>
        )
    }

}
