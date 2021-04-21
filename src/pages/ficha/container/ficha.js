import React, {Component} from 'react'
import { Tabs, Icon, Card, Button, Spin, Upload } from 'antd'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { Link } from 'react-router-dom'

import Actions from '../redux'
import TabDadosPessoais from '../components/tabDadosPessoais'
import TabRazao from '../components/tabRazao'
import TabPreco from '../components/tabPreco'

// import { hasAnyAuthority, getUnidadeAtual, getUser, getUnidadesAcesso } from '../../../../services/authenticationService'
// import VisitanteActions from '../../../sispen/visitante/redux'
// import VisitanteUnidadeActions from '../../../sispen/visitanteUnidade/redux'
// import AdvogadoActions from '../../../sispen/advogado/redux'
// import PrestadorServicoActions from '../../../sispen/prestadorServico/redux'
// import ServidorActions from '../../../sispen/servidor/redux'
// import TerceirizadoActions from '../../../sispen/terceirizado/redux'
// import BloqueioActions from '../../../acessoUnidade/bloqueio/redux'
// import VisitaPrioridaeActions from '../../../sispen/carteira/visitaPrioridade/redux'
// import Foto from '../../foto/container/foto'
// import { openNotification } from '../../../util/notification'
// import TabDadosBloqueio from '../components/tabDadosBloqueio'
// import TabDadosHistoricoVisita from '../components/tabDadosHistoricoVisita'
// import TabDadosHistoricoLotacaoServidor from '../components/tabDadosHistoricoLotacaoServidor'
// import TabDadosAfastamentoServidor from '../components/tabDadosAfastamentoServidor'
// import TabDadosOficioServidor from '../components/tabDadosOficioServidor'
// import TabUnidadeAcesso from '../components/tabUnidadeAcesso'
// import TabCarteiras from '../components/tabCarteiras'
import {
        EDITING, INSERTING,
        STATE_CADASTRO, 
        STATE_TAB_RAZAO, 
        STATE_TAB_PRECO,
        STATE_TAB_ORDEM,
        STATE_BLOQUEIOS, 
        STATE_HISTORICO_VISITAS, 
        STATE_HISTORICO_LOTACAO,
        STATE_AFASTAMENTO_SERVIDOR,
        STATE_OFICIO_SERVIDOR,
        STATE_UNIDADE_ACESSO, 
        STATE_CARTEIRAS} from '../../util/state'
import { CLIENTE, 
         FUNCIONARIO, 
         FORNECEDOR, 
       } from '../../util/tipoPessoa'
import { ICON_INSERIR, 
            ICON_EDITAR, 
            ICON_IMPRIMIR } from '../../util/constUtils'
import { getTitle, getHeader } from '../../util/helper'

class Ficha extends Component {

    UNSAFE_componentWillMount() {
        this.props.setState(STATE_CADASTRO)
        this.setState( { keyTabModuloCarteira : 1 })
    }
    
    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        const {
            match: { params: { id, tipoPessoa }},
            history,
            getCliente, 
            getPrestadorServico, 
            getVisitante,
            getVisitanteUnidade,
            getServidor,
            getTerceirizado,
            setTipoPessoa,             
        } = this.props

        setTipoPessoa(tipoPessoa)

        //&& hasAnyAuthority("FICHA_ADVOGADO_CONSULTAR")
        if (tipoPessoa == CLIENTE) {
            getCliente(id)
        } else if (tipoPessoa == FUNCIONARIO) {
            getPrestadorServico(id)            
        } else if (tipoPessoa == FORNECEDOR) {
            getVisitante(id)          
        } else {
            history.push("/acessoNegado")
        }
    }

    visualizarTab = (tab) => {
        this.props.setState(tab)
    }

    alterarPessoa = () => {
        const { dados: props, tipoPessoa } = this.props

        // if (tipoPessoa == ADVOGADO_DEFENSOR) {
        //     this.props.setStateAdvogado(EDITING)
        //     this.props.setAdvogado(props)
        // } else if (tipoPessoa == PRESTADOR_SERVICO) {
        //     this.props.setStatePrestadorServico(EDITING)
        //     this.props.setPrestadorServico(props)
        // } else if (tipoPessoa == VISITANTE_FAMILIAR) {
        //     this.props.setVisitanteVoltarFicha(true)
        //     this.props.setStateVisitante(EDITING)
        //     this.props.setVisitante(props)
        // } else if (tipoPessoa == VISITANTE_UNIDADE) {
        //     this.props.setStateVisitanteUnidade(EDITING)
        //     this.props.setVisitanteUnidade(props)
        // } else if (tipoPessoa == SERVIDOR) {
        //     this.props.setStateServidor(EDITING)
        //     this.props.setServidor(props)
        // } else if (tipoPessoa == TERCEIRIZADO) {
        //     this.props.setStateTerceirizado(EDITING)
        //     this.props.setTerceirizado(props)
        // }
    }  

    /*
    getExtraBloqueio = () => {
        return (
            <Link to={`/acesso/bloqueio/`} 
                  >
                <Button type={"primary"} 
                        icon={ICON_INSERIR}
                        onClick={(e) => this.adicionarBloqueio()}>
                    Adicionar Bloqueio
                </Button>
            </Link>
        )
    }  
    
    adicionarBloqueio = () => {
        const { dados: props, tipoPessoa } = this.props            
        this.props.setBloqueio({ 
                id: null,
                pessoa: props.pessoa,
                idPessoa : props.pessoa.id,
                tipoPessoa: tipoPessoa
            })           

        this.props.setStateBloqueio(INSERTING)
    }

    getExtraVisitaPrioridade = () => {
        return (
            <Link to={`/carteira/visitaPrioridade/`} 
                >
                <Button type={"primary"} 
                        icon={ICON_INSERIR}
                        onClick={(e) => this.adicionarVisitaPrioridade()}>
                    Adicionar Carteira de Visita
                </Button>
            </Link>
        )        
    }      

    adicionarVisitaPrioridade = () => {
        const { dados: props, tipoPessoa } = this.props            
        this.props.setVisitaPrioridade({ 
                id: null,
                pessoa: props.pessoa,
                idPessoa : props.pessoa.id,
                tipoPessoa: tipoPessoa
            })           

        this.props.setStateVisitaPrioridade(INSERTING)
    }    

    onChangeTabModuloCarteiras = (key) => {
        this.setState({
            keyTabModuloCarteira: key,
        });
    }  

    getLink = (tipoPessoa) =>{
        switch (tipoPessoa) {
            case ADVOGADO_DEFENSOR:
                return "/advogado/"
                break;
            case VISITANTE_FAMILIAR:
                return "/visitante/"
                break;
            case PRESTADOR_SERVICO:
                return "/prestadorServico/"
                break;   
            case VISITANTE_UNIDADE:
                return "/visitanteUnidade/"
                break;
            case SERVIDOR:
                return "/servidor/"
                break;
            case TERCEIRIZADO:
                return "/terceirizado/"
                break;                                
            default: break;
        }    
    }    
    */

    getInfo = (tipoPessoa) =>{
        switch (tipoPessoa) {
            case CLIENTE:
                return "Cliente"
            case FUNCIONARIO:
                return "Funcionário"
            case FORNECEDOR:
                return "Fornecedor"
            default: break;
        }    
    }

    getExtra = () => {
        return (
            ""
                // <Button type={"primary"} icon={'sync'} onClick={this.refresh}>
                //     Atualizar Ficha
                // </Button>
        )
    }

    render() {
        const { dados: props, state, tipoPessoa, fetching } = this.props
        const { id, nome } = props || {}
        
        //let habilitaEdicao = true//unidades.filter(c=> c.id == unidade.id ).length > 0           
             
        return (
            <Spin spinning={fetching}>
                {/* { getHeader(`Ficha ${ this.getInfo(tipoPessoa) }`) } */}
                <Card title={getTitle(`Ficha ${ this.getInfo(tipoPessoa) }`)} extra={this.getExtra()} >
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'block', paddingRight: '10px', textAlign: 'center'}}>                        
                            {/* <Card className={"card-ficha-custodiado"} style={{ width: 215 }}>                                
                                <div>        */}
                                    {/* { ( (isEqual(tipoPessoa, VISITANTE_FAMILIAR) && hasAnyAuthority("VISITANTE_ALTERAR")) ||
                                       (isEqual(tipoPessoa, ADVOGADO_DEFENSOR) && hasAnyAuthority("ADVOGADO_ALTERAR")) || 
                                       (isEqual(tipoPessoa, PRESTADOR_SERVICO) && hasAnyAuthority("PRESTADOR_SERVICO_ALTERAR")) ||
                                       (isEqual(tipoPessoa, VISITANTE_UNIDADE) && hasAnyAuthority("VISITANTE_UNIDADE_ALTERAR")) ||
                                       (isEqual(tipoPessoa, SERVIDOR) && hasAnyAuthority("SERVIDOR_SCC_ALTERAR")) ||
                                       (isEqual(tipoPessoa, TERCEIRIZADO) && hasAnyAuthority("TERCEIRIZADO_SISTERC_ALTERAR")) 
                                      ) &&
                                        <Link to={`${ this.getLink(tipoPessoa) }`} 
                                            onClick={(e) => this.alterarPessoa()}>
                                            <Button type={"primary"} 
                                                    icon={ICON_EDITAR}
                                                    disabled={!habilitaEdicao}>
                                                Editar
                                            </Button>
                                        </Link>
                                    } */}
                                    {/* <Button type={"primary"} 
                                            icon={ICON_IMPRIMIR}
                                            disabled = { 
                                                (isEqual(tipoPessoa, VISITANTE_FAMILIAR) && !hasAnyAuthority("FICHA_VISITANTE_IMPRIMIR")) ||
                                                (isEqual(tipoPessoa, ADVOGADO_DEFENSOR) && !hasAnyAuthority("FICHA_ADVOGADO_IMPRIMIR")) ||
                                                (isEqual(tipoPessoa, PRESTADOR_SERVICO) && !hasAnyAuthority("FICHA_PRESTADOR_SERVICO_IMPRIMIR")) ||
                                                (isEqual(tipoPessoa, VISITANTE_UNIDADE) && hasAnyAuthority("VISITANTE_UNIDADE_IMPRIMIR")) ||
                                                (isEqual(tipoPessoa, SERVIDOR) && hasAnyAuthority("FICHA_SERVIDOR_IMPRIMIR")) ||
                                                (isEqual(tipoPessoa, TERCEIRIZADO) && hasAnyAuthority("FICHA_TERCEIRIZADO_IMPRIMIR")) 
                                            }
                                            onClick={(e) => this.props.imprimir(props.pessoa.id, tipoPessoa)}                                            
                                            style={{ marginLeft: "5px" }}>
                                            Imprimir
                                    </Button> */}
                                {/* </div>
                            </Card> */}
                            <Button type={isEqual(state, STATE_CADASTRO) ? "primary" : ""} 
                                    icon="contacts"
                                    style={{marginTop: '5px', width: '200px', textAlign: "left" }}
                                    onClick={() => this.visualizarTab(STATE_CADASTRO)}> {`Dados do ${this.getInfo(tipoPessoa) }`} 
                            </Button>  
                            <br/>   
                            {/* && hasAnyAuthority("FICHA_VISITANTE_-_CUSTODIADO_CONSULTAR")) ||  */}
                            { ( isEqual(tipoPessoa, CLIENTE)) &&                   
                                <React.Fragment>
                                    <Button type={isEqual(state, STATE_TAB_RAZAO) ? "primary" : ""}
                                            icon="number"
                                            style={{marginTop: '5px', width: '200px', textAlign: "left" }}
                                            onClick={() => this.visualizarTab(STATE_TAB_RAZAO)}>Razões
                                    </Button>
                                    <br/>
                                </React.Fragment>
                            }
                            { ( isEqual(tipoPessoa, CLIENTE)) &&                   
                                <React.Fragment>
                                    <Button type={isEqual(state, STATE_TAB_PRECO) ? "primary" : ""}
                                            icon="number"
                                            style={{marginTop: '5px', width: '200px', textAlign: "left" }}
                                            onClick={() => this.visualizarTab(STATE_TAB_PRECO)}>Tabela de preço
                                    </Button>
                                    <br/>
                                </React.Fragment>
                            }                            
                            {/* {
                               ((isEqual(tipoPessoa, VISITANTE_FAMILIAR) && hasAnyAuthority("FICHA_VISITANTE_-_CARTEIRAS_CONSULTAR")) || 
                                (isEqual(tipoPessoa, ADVOGADO_DEFENSOR) && hasAnyAuthority("FICHA_ADVOGADO_-_CARTEIRAS_CONSULTAR")) ||
                                (isEqual(tipoPessoa, PRESTADOR_SERVICO) && hasAnyAuthority("FICHA_PRESTADOR_SERVICO_-_CARTEIRAS_CONSULTAR")) 
                                ) &&
                                <React.Fragment>
                                    <Button type={isEqual(state, STATE_CARTEIRAS) ? "primary" : ""}
                                            icon="idcard"
                                            style={{marginTop: '5px', width: '200px', textAlign: "left" }}
                                            onClick={() => this.visualizarTab(STATE_CARTEIRAS)}>Carteiras
                                    </Button>   
                                    <br/>  
                                </React.Fragment>
                            } */}
                        </div>
                        {
                            isEqual(state, STATE_CADASTRO) &&    
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={1} tab={<span><Icon type="form" />Dados gerais</span>} >
                                        <TabDadosPessoais {...props} tipoPessoa= {tipoPessoa}/>
                                    </Tabs.TabPane>
                                </Tabs> 
                            </div>
                        }
                        {
                            isEqual(state, STATE_TAB_RAZAO) && (isEqual(tipoPessoa, CLIENTE) 
                            ) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={4} tab={<span><Icon type="solution" />Razões</span>} >
                                        <TabRazao {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        }
                        {
                            isEqual(state, STATE_TAB_PRECO) && (isEqual(tipoPessoa, CLIENTE) 
                            ) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={4} tab={<span><Icon type="solution" />Razões</span>} >
                                        <TabPreco {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        }                        
                        {/* {
                            isEqual(state, STATE_BLOQUEIOS) &&
                            <div style={{width: '100%'}}>
                                <Card title="Bloqueios" 
                                      style={{ width: '100%' }}
                                      extra={  
                                        (isEqual(tipoPessoa, VISITANTE_FAMILIAR) && hasAnyAuthority("FICHA_VISITANTE_-_BLOQUEIO_INSERIR")) ||
                                        (isEqual(tipoPessoa, ADVOGADO_DEFENSOR) && hasAnyAuthority("FICHA_ADVOGADO_-_BLOQUEIO_INSERIR")) ||
                                        (isEqual(tipoPessoa, PRESTADOR_SERVICO) && hasAnyAuthority("FICHA_PRESTADOR_SERVICO_-_BLOQUEIO_INSERIR")) ||
                                        (isEqual(tipoPessoa, VISITANTE_UNIDADE) && hasAnyAuthority("FICHA_VISITANTE_UNIDADE_-_BLOQUEIO_INSERIR"))
                                        ? this.getExtraBloqueio() : '' } >
                                    <TabDadosBloqueio {...props} tipoPessoa= {tipoPessoa}/>
                                </Card>                                                                
                            </div>
                        } */}
                        {/* {
                            isEqual(state, STATE_HISTORICO_VISITAS) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={6} tab={<span><Icon type="form" />Histórico de Visitas</span>} >
                                        <TabDadosHistoricoVisita {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        } */}
                        {/* {isEqual(state, STATE_HISTORICO_LOTACAO) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={6} tab={<span><Icon type="form" />Histórico de Lotação</span>} >
                                        <TabDadosHistoricoLotacaoServidor {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        } */}
                        {/* {isEqual(state, STATE_OFICIO_SERVIDOR) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={6} tab={<span><Icon type="form" />Afastamentos</span>} >
                                        <TabDadosOficioServidor {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        } */}
                        {/* {isEqual(state, STATE_AFASTAMENTO_SERVIDOR) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={6} tab={<span><Icon type="form" />Afastamentos</span>} >
                                        <TabDadosAfastamentoServidor {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        } */}
                        {/* {
                            isEqual(state, STATE_UNIDADE_ACESSO) &&
                            <div style={{width: '100%'}}>
                                <Tabs type="card" style={{width: '100%'}}>
                                    <Tabs.TabPane key={7} tab={<span><Icon type="bank" />Unidades de acesso</span>} >
                                        <TabUnidadeAcesso {...props}/>
                                    </Tabs.TabPane>                                
                                </Tabs> 
                            </div>
                        } */}
                        {/* {
                            isEqual(state, STATE_CARTEIRAS) &&
                            <div style={{width: '100%'}}>
                                 <Card title="Módulo de Carteiras" 
                                      style={{ width: '100%' }}
                                      extra={  
                                       (isEqual(tipoPessoa, VISITANTE_FAMILIAR) && hasAnyAuthority("FICHA_VISITANTE_-_CARTEIRAS_INSERIR")) ||
                                        (isEqual(tipoPessoa, ADVOGADO_DEFENSOR) && hasAnyAuthority("FICHA_ADVOGADO_-_CARTEIRAS_INSERIR")) ||
                                        (isEqual(tipoPessoa, PRESTADOR_SERVICO) && hasAnyAuthority("FICHA_PRESTADOR_SERVICO_-_CARTEIRAS_INSERIR")) 
                                        ? this.getExtraVisitaPrioridade() : '' } >
                                    <Tabs type="card" style={{width: '100%'}} onChange={this.onChangeTabModuloCarteiras}>
                                        <Tabs.TabPane key={1} tab={<span><Icon type="solution" /> Carteiras de Visita</span>} >
                                            <TabCarteiras {...props} tipoPessoa= {tipoPessoa}/>
                                        </Tabs.TabPane>
                                    </Tabs>                                             
                                </Card>                                  
                            </div>
                        }                         */}
                    </div>
                </Card>
            </Spin>
        )
    }
}

const mapStateToProps = ({ fichaPessoa: { data: { dados = {}}, fetching, state, tipoPessoa }, login}) => {
    return { fetching, dados, state, tipoPessoa, profile: login.data.profile }
}

const mapDispatchToProps = (dispatch) => ({
    getDados: (id, tipoPessoa) => dispatch(Actions.fichaPessoaGetDados(id, tipoPessoa)),    
    setState: (state) => dispatch(Actions.fichaPessoaSetState(state)),
    setTipoPessoa: (tipoPessoa) => dispatch(Actions.fichaPessoaSetTipoPessoa(tipoPessoa)),
    getCliente: (id) => dispatch(Actions.fichaPessoaGetCliente(id)),

    imprimir: (id, tipoPessoa) => dispatch(Actions.fichaPessoaImprimir(id, tipoPessoa)),
    setStateVisitante: (state) => dispatch(VisitanteActions.visitanteSetState(state)),
    setVisitanteVoltarFicha: (voltarFicha) => dispatch(VisitanteActions.visitanteSetVoltarFicha(voltarFicha)),
    setVisitante: (visitante) => dispatch(VisitanteActions.visitanteSetVisitante(visitante)),
    getVisitante: (id) => dispatch(Actions.fichaPessoaGetVisitante(id)),
    setStateBloqueio: (state) => dispatch(BloqueioActions.bloqueioSetState(state)),
    setBloqueio: (bloqueio) => dispatch(BloqueioActions.bloqueioSetBloqueio(bloqueio)),        
    setStateAdvogado: (state) => dispatch(AdvogadoActions.advogadoSetState(state)),    
    setAdvogado: (advogado) => dispatch(AdvogadoActions.advogadoSetAdvogado(advogado)),    
    
    setStatePrestadorServico: (state) => dispatch(PrestadorServicoActions.prestadorServicoSetState(state)),
    setPrestadorServico: (prestadorServico) => dispatch(PrestadorServicoActions.prestadorServicoSetPrestadorServico(prestadorServico)),
    getPrestadorServico: (id) => dispatch(Actions.fichaPessoaGetPrestadorServico(id)),
    alterarFoto: (obj) => dispatch(Actions.fichaPessoaAlterarFoto(obj)),
    setStateVisitaPrioridade: (state) => dispatch(VisitaPrioridaeActions.visitaPrioridadeSetState(state)),
    setVisitaPrioridade: (bloqueio) => dispatch(VisitaPrioridaeActions.visitaPrioridadeSetVisitaPrioridade(bloqueio)),        
    setStateVisitanteUnidade: (state) => dispatch(VisitanteUnidadeActions.visitanteUnidadeSetState(state)),    
    setVisitanteUnidade: (visitanteUnidade) => dispatch(VisitanteUnidadeActions.visitanteUnidadeSetVisitanteUnidade(visitanteUnidade)),    
    getVisitanteUnidade: (id) => dispatch(Actions.fichaPessoaGetVisitanteUnidade(id)),    
    getServidor: (id) => dispatch(Actions.fichaPessoaGetServidor(id)),
    setServidor: (servidor) => dispatch(ServidorActions.servidorSetServidor(servidor)),
    setStateServidor: (state) => dispatch(ServidorActions.servidorSetState(state)),
    getTerceirizado: (id) => dispatch(Actions.fichaPessoaGetTerceirizado(id)),
    setTerceirizado: (terceirizado) => dispatch(TerceirizadoActions.terceirizadoSetTerceirizado(terceirizado)),
    setStateTerceirizado: (state) => dispatch(TerceirizadoActions.terceirizadoSetState(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Ficha)