import React, { Component } from 'react'
import { Table, Icon, Tooltip } from 'antd'
import { connect } from 'react-redux'
import ServidorActions from '../../../sispen/servidor/redux'
import moment from 'moment'

class TabDadosOficioServidor extends Component {

    imprimirOficio = (oficio) => {
        let filtro = { idOficioMemorando: oficio.id }
        this.props.imprimir(filtro)
    }

    render() {

        const { oficios = [] } = this.props

        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={oficios} >

                    <Table.Column title={"Data Ofício"} 
                                  dataIndex={"dataOficio"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column title={"Data Apresentação"} 
                                  dataIndex={"dataApresentacao"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column title={"Tipo Ofício"} 
                                  dataIndex={"tipoOficio.descricao"} 
                                  align={"center"} />
                    <Table.Column title={"Número"} dataIndex={"numeroOficio"} align={"center"}/>

                    <Table.Column title={'Ações'} key={"actions"}
                        dataIndex={"actions"}
                        align={"center"}
                        render={(text, record) => {
                            return (
                                <>
                                    {
                                        record.id &&
                                        <Tooltip title="Imprimir ofício">
                                            <Icon style={{ cursor: 'printer' }} type={'file-pdf'} onClick={(e) => this.imprimirOficio(record)}></Icon>
                                        </Tooltip>
                                        
                                    }
                                </>)
                        }} 
                    />
                    
                </Table>
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch) => ({
    imprimir: (obj) => dispatch(ServidorActions.servidorImprimir(obj)),
})

export default connect(null, mapDispatchToProps)(TabDadosOficioServidor)
