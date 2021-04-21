import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'

export default class TabRazao extends Component {

    render() {
        const { clienteRazaoList = [] } = this.props || {}
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={clienteRazaoList}>
                    {/* <Table.Column key={"1"} title={"Tipo de Documento"} dataIndex={"tipoDocumentoPessoa.descricao"} align={"center"}/> */}
                    <Table.Column key={"1"} title={"Nome Fantasia"} dataIndex={"nomeFantasia"} align={"center"}/>
                    <Table.Column key={"2"} title={"Cpf/Cnpj"} dataIndex={"cpfCnpj"} align={"center"}/>
                </Table>
            </div>
        )
    }

}
