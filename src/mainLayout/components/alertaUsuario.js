import React, { Component } from 'react'
import { Card, Tooltip, Icon, Button, Table, Modal, Divider } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import Actions from '../redux'
import { get, isEmpty, isNil } from 'lodash'
import { Link } from 'react-router-dom'
import { hasAnyAuthority } from '../../services/authenticationService'
import Pagination from '../../pages/util/Pagination'
//import { URL_DOCUMENTO } from '../../pages/util/constUrlUtils'

const Sheet = Workbook.Sheet
const Column = Workbook.Column

class AlertaUsuario extends Component {    
    // getExtra = (length) => {
    //     if (length && length > 0) {
    //         return (
    //             <div>
    //                 <Workbook filename='pendências.xlsx'
    //                     element={
    //                         <Tooltip title='Click para baixar os registros.' placement='left'>
    //                             <Button type='primary' shape='circle' size='small' icon='download' />
    //                         </Tooltip>
    //                     }>
    //                     <Sheet data={this.props.alertaUsuarioList || []} name='alertaUsuarioList'>
    //                         <Column label='Tipo Pendência' value={row => row.tipoPendencia ? row.tipoPendencia.descricao : ''} />
    //                         <Column label='Descrição' value={row => row.descricao ?  row.descricao : '' } />
    //                         <Column label='Data Inclusão' value={row => row.dataInclusao ? moment(row.dataInclusao, 'YYYY-MM-DD').format('DD/MM/YYYY')  : '' } />
    //                     </Sheet>
    //                 </Workbook>
    //             </div>)
    //     }
    // }

    inativarAlerta = (record) => {
        // this.props.setModalAlertaUsuarioVisivel(false);
        // this.props.inativarAlerta(record)     
        window.location.reload(false); // Refresh page   
    }

    marcarLidoEvent = (record) => {
        const { confirm } = Modal;
        const { marcarLido } = this.props;

        confirm({
            title: 'Tem certeza que deseja marcar como lido?',
            content: 'Ação não tem como ser desfeita.',
            onOk() {
                //marcarLido(record);
                window.location.reload(false); // Refresh page
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }

    render() {
        const { alertaUsuarioList = [], tipoAlertaUsuarioList = [] } = this.props

        return (
            alertaUsuarioList.length > 0 &&
            <Modal
                title="Alertas"
                visible={this.props.modalAlertaUsuarioVisivel}            
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width = {1000} >             
                <Card title={ "Lista de Alertas" } //extra={ this.getExtra(alertaUsuarioList.length)} 
                >
                    <Table rowKey={ (row) => row.id} 
                            dataSource={alertaUsuarioList} 
                            size={"middle"}
                            pagination={Pagination()}>  
                        <Table.Column title={<center>Tipo alerta</center>} 
                                    key={"idTipoAlerta"} 
                                    dataIndex={"idTipoAlerta"} 
                                    align={"center"} 
                                    render={ (text) => tipoAlertaUsuarioList.map(d => { if(d.id == text) return d.descricao }) }
                                    />
                        <Table.Column key={'descricao'} 
                                        dataIndex={'descricao'} 
                                        title={<center>Descrição</center>} 
                                        align={ "left" }/>
                        <Table.Column key={'dataAlerta'} 
                                        dataIndex={'dataAlerta'} 
                                        title={<center>Data alerta</center>} 
                                        align={ "center" }
                                        render={(text) => text && moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY')}/>
                        <Table.Column key={'acoes'} 
                                        dataIndex={'acoes'} 
                                        title={<center>Ações</center>} 
                                        align={ "center" }
                                        width={'7%'}
                                        render={(text, record) => (
                                        <span>
                                           {record.idTipoAlerta == 3 && //DOCUMENTO PARECER JURÍDICO
                                            <div>
                                                <Tooltip title="Desativar alerta">                                                  
                                                        <Icon 
                                                            style={{cursor: 'pointer'}} 
                                                            type={ 'api' } 
                                                            onClick = { (e) => this.inativarAlerta(record) }
                                                        />
                                                </Tooltip>
                                            </div>}
                                            { record.idTipoAlerta == 2 && //DOCUMENTOS NÃO LIDOS                                              
                                            <div>
                                                {/* {hasAnyAuthority("FICHA_CUSTODIADO_-_ANEXO_CONSULTAR") &&
                                                <Tooltip title="Ver Documento">
                                                    <a href={URL_DOCUMENTO + `/${record.anexo}`}
                                                        target={'_blank'}>
                                                        <Icon style={{cursor: 'pointer'}} type={ 'file-pdf' } />
                                                    </a>
                                                </Tooltip>    
                                                } */}
                                                <Divider type="vertical"/> 
                                                {hasAnyAuthority("FICHA_CUSTODIADO_-_ANEXO_ALTERAR") &&                                           
                                                <Tooltip title="Marcar como lido">                                                  
                                                        <Icon 
                                                            style={{cursor: 'pointer'}} 
                                                            type={ 'check' } 
                                                            onClick = { (e) => this.marcarLidoEvent(record) }
                                                        />
                                                </Tooltip> 
                                                }                                               
                                            </div>}                                            
                                        </span>
                                        )}/>
                    </Table>
                </Card>
            </Modal>
        )
    }

    handleOk = e => {
        this.props.setModalAlertaUsuarioVisivel(false);    
    };

    handleCancel = e => {
        this.props.setModalAlertaUsuarioVisivel(false);        
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.mainLayout.data,
        modalAlertaUsuarioVisivel: state.mainLayout.modalAlertaUsuarioVisivel,
        fetching: state.mainLayout.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({    
    setModalAlertaLogisticaVisivel: (visibilidade) => dispatch(Actions.mainLayoutSetModalAlertaLogisticaVisivel(visibilidade)), 
    //inativarAlerta: (obj) => dispatch(Actions.mainLayoutInativarAlerta(obj)),
    //marcarLido: (obj) => dispatch(Actions.mainLayoutMarcarLido(obj)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertaUsuario)