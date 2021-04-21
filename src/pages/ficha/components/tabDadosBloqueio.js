import React, { Component } from 'react'
import { Tag, Table, Icon, Button } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { hasAnyAuthority } from '../../../../services/authenticationService'
import BloqueioActions from '../../../acessoUnidade/bloqueio/redux'
import { EDITING, INSERTING } from '../../../util/state'
import { getTagSituacaoBloqueio } from '../../../util/helper'
import { ICON_EDITAR } from '../../../util/constUtils'

//export default class TabDadosBloqueio extends Component {
class TabDadosBloqueio extends Component {
    prepareUpdate = (bloqueio) => {
        const { setStateBloqueio, setBloqueio, pessoa, idTipoPessoa } = this.props
        setStateBloqueio(EDITING)
        setBloqueio({ 
            ...bloqueio,
            pessoa: pessoa,
            idPessoa : pessoa.id,
            idTipoPessoa: idTipoPessoa
        })        
    }    

    render() {
        const { pessoa } = this.props
        const { bloqueios = [], blacklist = [] } = pessoa || {}
        const result = bloqueios.map(i => ({...i, tipo: 'NORMAL'})).concat(blacklist.map(i => ({...i, tipo: 'BLACKLIST'})))
                
        return (
            <div>
                <Table rowKey={(({id}) => id)} dataSource={result}>
                    <Table.Column key={"1"} title={"Tipo"} dataIndex={"tipo"} align={"center"}/>
                    <Table.Column key={"2"} 
                                  title={"Data início"} 
                                  dataIndex={"dataInicio"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column key={"3"} 
                                  title={"Data fim"} 
                                  dataIndex={"dataFim"} 
                                  align={"center"}
                                  render={(text) => text && moment(text).format('DD/MM/YYYY')}/>
                    <Table.Column key={"4"} 
                                  title={"Status"} 
                                  dataIndex={"idStatus"} 
                                  align={"center"}
                                  render={(text) => getTagSituacaoBloqueio(text)}/>/>
                    <Table.Column key={"5"} title={"Motivo"} dataIndex={"motivo"} align={"center"}/>
                    <Table.Column key={"6"} title={"Unidade"} dataIndex={"acessoPessoaUnidade.unidade.abreviacao"} align={"center"}/>
                    <Table.Column key={"7"} title={"Resp. Bloqueio"} dataIndex={"usuarioResponsavel.nome"} align={"center"}/>
                    <Table.Column key={'acoes'} 
                                dataIndex={'acoes'}                                       
                                align={ "center" }
                                width={'7%'}
                                render={(text, record) => (
                                <span> 
                                    { (hasAnyAuthority("FICHA_VISITANTE_-_BLOQUEIO_ALTERAR") || hasAnyAuthority("FICHA_ADVOGADO_-_BLOQUEIO_ALTERAR"))  &&
                                    <React.Fragment>
                                        <Link to={`/acesso/bloqueio/`}                             
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
    setStateBloqueio: (state) => dispatch(BloqueioActions.bloqueioSetState(state)),
    setBloqueio: (bloqueio) => dispatch(BloqueioActions.bloqueioSetBloqueio(bloqueio)),        
})

export default connect(mapStateToProps, mapDispatchToProps)(TabDadosBloqueio)
