import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'

export default class TabPreco extends Component {

    render() {
        const { clienteTabelaPrecoList = [] } = this.props || {}
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={clienteTabelaPrecoList}>
                    <Table.Column key={"1"} title={"Tabela de preço"} dataIndex={"tabelaPreco.nome"} align={"center"}/>
                </Table>
            </div>
        )
    }

}
