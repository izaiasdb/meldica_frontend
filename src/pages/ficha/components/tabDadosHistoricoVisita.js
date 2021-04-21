import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { isNil } from 'lodash'

export default class TabDadosHistoricoVisita extends Component {

    render() {
        const { pessoa } = this.props
        const { historicoVisita = [] } = pessoa || {}        
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={historicoVisita}>
                    <Table.Column key={"1"} 
                                  title={"Custodiado"} 
                                  dataIndex={"preso"} 
                                  align={"center"}
                                  render={(text) => {
                                    return isNil(text) ?
                                         "" : (<Link to={`/ficha/custodiado/${text.id}`} >{text.descricao}</Link>)
                                  }}/>
                    <Table.Column key={"3"} title={"Unidade"} dataIndex={"unidade.descricao"} align={"center"}/>
                    <Table.Column key={"2"} title={"Relação"} dataIndex={"relacao"} align={"center"}/>
                    <Table.Column key={"4"} 
                                  title={"Data de Entrada"} 
                                  dataIndex={"dataEntrada"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY hh:mm:ss')}/>
                    <Table.Column key={"5"} 
                                  title={"Data de Saída"} 
                                  dataIndex={"dataSaida"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY hh:mm:ss')}/>                                  
                    
                </Table>
            </div>
        )
    }

}
