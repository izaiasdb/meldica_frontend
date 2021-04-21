import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default class TabUnidadeAcesso extends Component {

    render() {
        const { pessoa } = this.props
        const { unidadesAcesso = [] } = pessoa || {}        
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={unidadesAcesso}>
                    <Table.Column key={"1"} 
                                  title={"Data cadastro"} 
                                  dataIndex={"dataInclusao"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY hh:mm:ss')}/>
                    <Table.Column key={"3"} title={"Unidade"} dataIndex={"unidade.abreviacao"} align={"center"}/>
                </Table>
            </div>
        )
    }

}
