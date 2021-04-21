import React, { Component } from 'react'
import { Tag, Table, Icon, Button } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import Actions from '../../../sispen/carteira/visitaPrioridade/redux'
import { EDITING, INSERTING } from '../../../util/state'
import { ICON_EDITAR } from '../../../util/constUtils'

class TabCarteiras extends Component {
    prepareUpdate = (bloqueio) => {
        const { setState, setVisitaPrioridade, pessoa, idTipoPessoa } = this.props
        setState(EDITING)
        setVisitaPrioridade({ 
            ...bloqueio,
            pessoa: pessoa,
            idPessoa : pessoa.id,
            idTipoPessoa: idTipoPessoa
        })        
    }    

    render() {
        const { pessoa } = this.props
        const { carteiraVisitaPrioridadeList = [] } = pessoa || {}
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={carteiraVisitaPrioridadeList}>
                    {/*  */}
                    <Table.Column key={"1"} 
                                  title={"Data Inclusão"} 
                                  dataIndex={"dataHoraInclusao"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column key={"2"} title={"Tipo Documento"} dataIndex={"tipoArquivo.descricao"} align={"center"}/>
                    <Table.Column key={"3"} title={"Motivo"} dataIndex={"nome"} align={"center"}/>
                    <Table.Column key={"4"} title={"Observação"} dataIndex={"observacao"} align={"center"}/>
                    <Table.Column key={"5"} 
                                  title={"Data Validade"} 
                                  dataIndex={"dataValidade"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>                
                    <Table.Column key={'acoes'} 
                                dataIndex={'acoes'}                                       
                                align={ "center" }
                                width={'7%'}
                                render={(text, record) => (
                                <span> 
                                    { (hasAnyAuthority("FICHA_VISITANTE_-_CARTEIRAS_ALTERAR") || hasAnyAuthority("FICHA_PRESTADOR_SERVICO_-_CARTEIRAS_ALTERAR"))  &&
                                    <React.Fragment>
                                        <Link to={`/carteira/visitaPrioridade/`}                             
                                                style = {{ marginLeft: "5px"}}
                                                onClick={(e) => this.prepareUpdate(record)}>
                                            <Button type={"edit"} 
                                                    icon={ICON_EDITAR}>
                                            </Button>
                                        </Link>  
                                    </React.Fragment>
                                    }                                          
                                </span>
                                )}/>                    
                </Table>
            </div>
        )
    }
}


const mapStateToProps = ({ fichaPessoa: { data: { dados = {}}, fetching, state }}) => {
    return { fetching, dados, state }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(Actions.visitaPrioridadeSetState(state)),
    setVisitaPrioridade: (bloqueio) => dispatch(Actions.visitaPrioridadeSetVisitaPrioridade(bloqueio)),        
})

export default connect(mapStateToProps, mapDispatchToProps)(TabCarteiras)
