import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'

export default class TabDadosHistoricoLotacaoServidor extends Component {

    render() {

        const { historicoLotacao = [] } = this.props
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={historicoLotacao}>
                    <Table.Column key={"1"} title={"Lotação Anterior a Alteração"} dataIndex={"descricaoLotacao"} align={"left"}/>
                    <Table.Column key={"2"} 
                                  title={"Data Alteração"} 
                                  dataIndex={"dataInclusao"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    
                </Table>
            </div>
        )
    }

}
