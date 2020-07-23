import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import MainLayout from './mainLayout'
import LoginActions from './pages/login/redux'
import { isAuthenticated } from './services/authenticationService';

//************************************ Comum ************************************/
import Login from './pages/login/login'
// import AlterarSenha from './pages/login/alterarSenha'
// import Dashboard from './pages/dashboard/container/dashboard'

// import MensagemDashboard from './pages/mensagemDashboard/container/mensagemDashboard'
// import PadraoUnidade from './pages/configuracao/padraoUnidade/container/padraoUnidade'
// import RegraVisita from './pages/configuracao/regraVisita/container/regraVisita'

//************************************ Controle usuário ************************************/
// import Sistema from './pages/controleUsuario/sistema/container/sistema'
// import Modulo from './pages/controleUsuario/modulo/container/modulo'
// import Menu from './pages/controleUsuario/menu/container/menu'
// import Perfil from './pages/controleUsuario/perfil/container/perfil'
// import Usuario from './pages/controleUsuario/usuario/container/usuario'

//************************************ Sispen ************************************/
// import Custodiado from './pages/sispen/custodiado/container/custodiado'
// import CustodiadoForm from './pages/sispen/custodiado/components/formulario'
// import Visitante from './pages/sispen/visitante/container/visitante';
// import Advogado from './pages/sispen/advogado/container/advogado'
// import PrestadorServico from './pages/sispen/prestadorServico/container/prestadorServico'
// import Movimentacao from './pages/sispen/movimentacao/container/movimentacao'
// import OcorrenciaUnidade from './pages/sispen/ocorrenciaUnidade/container/ocorrenciaUnidade'
// import FichaCustodiado from './pages/ficha/custodiado/container/fichaCustodiado'
// import FichaVisitante from './pages/ficha/visitante/container/fichaVisitante'
// import FichaPessoa from './pages/ficha/pessoa/container/fichaPessoa'
// import Processo from './pages/sispen/processo/container/processo'
// import Incidencia from './pages/sispen/incidencia/container/incidencia'
// import AtendimentoMedico from './pages/sispen/atendimentoMedico/container/atendimentoMedico'
// import QuestionarioPessoa from './pages/sispen/questionarioPessoa/container/questionarioPessoa'
// import FilaEntradaVisitante from './pages/sispen/autorizacaoVisitante/components/filaEntradaVisitante/container/filaEntradaVisitante'
// import FilaSaidaVisitante from './pages/sispen/autorizacaoVisitante/components/filaSaidaVisitante/container/filaSaidaVisitante'
// import EntradaSaidaVisitante from './pages/sispen/autorizacaoVisitante/components/entradaSaidaVisitante/container/entradaSaidaVisitante'
// import AutorizacaoVisitante from './pages/sispen/autorizacaoVisitante/container/autorizacaoVisitante'

//************************************ Controle acesso ************************************/
// import Bloqueio from './pages/acessoUnidade/bloqueio/container/bloqueio'
// import AcessoUnidade from './pages/acessoUnidade/acessoUnidade/container/acessoUnidade'

//************************************ Relatórios ************************************/
// import RelatorioCustodiado from './pages/relatorios/custodiado/populacaoCarceraria/container/relatorio'
// import RelatorioBiometria from './pages/relatorios/biometria/custodiadoPorUnidade/container/relatorio'
// import VisitaSenha from './pages/relatorios/visita/visitaSenha/container/relatorio'
// import RelatorioConfere from './pages/relatorios/custodiado/confere/container/relatorio'
// import PopulacaocarcerariaResumo from './pages/relatorios/custodiado/populacaoCarcerariaResumo/container/relatorio'
// import RelatorioDepenCrime from './pages/relatorios/custodiado/depenCrime/container/relatorio'
// import RelatorioAtendimentoMedico from './pages/relatorios/custodiado/atendimentoMedico/container/relatorio'
// import RelatorioAtendimentoMedicoLinha from './pages/relatorios/custodiado/atendimentoMedico/components/linha/container/linha'
// import RelatorioVacina from './pages/relatorios/custodiado/vacina/container/relatorio'
// import RelatorioMedicamento from './pages/relatorios/custodiado/medicamento/container/relatorio'
// import RelatorioPatologia from './pages/relatorios/custodiado/patologia/container/relatorio'
// import RelatorioGeralEstatistica from './pages/relatorios/geralEstatistica/container/relatorio'

//************************************ Domínios *******************/
// import Unidade from './pages/dominio/unidade/container/unidade'
// import EspecialidadeMedica from './pages/dominio/especialidadeMedica/container/especialidadeMedica'
// import TipoVacina from './pages/dominio/tipoVacina/container/tipoVacina'
// import Medicamento from './pages/dominio/medicamento/container/medicamento'
// import NaturezaOcorrencia from './pages/dominio/naturezaOcorrencia/container/naturezaOcorrencia'
// import Patologia from './pages/dominio/patologia/container/patologia'
// import CrudGeralDominio from './pages/dominio/geral/container/crudGeralDominio'

const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route  {...rest} 
                render={props => isAuthenticated() ? (<Component {...props} />) : (
                    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
                )}/>
)

const Routes = () => (            
        <React.Fragment>            
            {/************************************* Comum *************************************/}
            <Route exact path='/login' component={Login} />
            {/* <Route exact path='/alterarSenha' component={AlterarSenha} /> */}
            {/* <PrivateRoute exact path='/' component={Dashboard} /> */}
            {/* <PrivateRoute path='/dashboard' component={Dashboard} /> */}

            {/************************************* Configuração *************************************/}
            {/* <PrivateRoute path='/mensagemDashboard' component={MensagemDashboard} />
            <PrivateRoute path='/configuracao/padraoUnidade' component={PadraoUnidade} />
            <PrivateRoute path='/configuracao/regraVisita' component={RegraVisita} /> */}

            {/************************************* Controle usuário *************************************/}
            {/* <PrivateRoute path='/controle/sistema' component={Sistema} />
            <PrivateRoute path='/controle/modulo' component={Modulo} />
            <PrivateRoute path='/controle/menu' component={Menu} />
            <PrivateRoute path='/controle/perfil' component={Perfil} />
            <PrivateRoute path='/controle/usuario' component={Usuario} /> */}

            {/************************************* Sispen *************************************/}
            {/* <PrivateRoute path='/custodiado' component={Custodiado} />
            <PrivateRoute path='/custodiadoForm' component={CustodiadoForm} />
            <PrivateRoute path='/visitante' component={Visitante} />
            <PrivateRoute path='/advogado' component={Advogado} />
            <PrivateRoute path='/prestadorServico' component={PrestadorServico} />
            <PrivateRoute path='/movimentacao' component={Movimentacao} />
            <PrivateRoute path='/ocorrenciaUnidade' component={OcorrenciaUnidade} />
            <PrivateRoute path='/ficha/custodiado/:id' component={FichaCustodiado} />
            <PrivateRoute path='/ficha/visitante/:id' component={FichaVisitante} />
            <PrivateRoute path='/ficha/pessoa/:id/:idTipoPessoa' component={FichaPessoa} />            
            <PrivateRoute path='/processo' component={Processo} />
            <PrivateRoute path='/incidencia' component={Incidencia} />
            <PrivateRoute path='/atendimentoMedico' component={AtendimentoMedico} />
            <PrivateRoute path='/questionarioPessoa' component={QuestionarioPessoa} />
            <PrivateRoute path='/autorizacaoVisitante/filaEntradaVisitante' component={FilaEntradaVisitante} />
            <PrivateRoute path='/autorizacaoVisitante/filaSaidaVisitante' component={FilaSaidaVisitante} />
            <PrivateRoute path='/autorizacaoVisitante/entradaSaidaVisitante' component={EntradaSaidaVisitante} />
            <PrivateRoute path='/autorizacaoVisitante' component={AutorizacaoVisitante} /> */}

            {/************************************* Controle acesso *************************************/}
            {/* <PrivateRoute path='/acesso/unidade' component={AcessoUnidade} />
            <PrivateRoute path='/acesso/bloqueio' component={Bloqueio} /> */}

            {/************************************* Ocorrências *************************************/}
            {/* <PrivateRoute path='/ocorrencias' component={() => <h1>Ocorrências</h1>} /> */}

            {/************************************* Relatórios *************************************/}
            {/* <PrivateRoute path='/relatorios/custodiado/populacaoCarceraria' component={RelatorioCustodiado} />
            <PrivateRoute path='/relatorios/biometria/custodiadoPorUnidade' component={RelatorioBiometria} />                   
            <PrivateRoute path='/relatorios/visita/visitaSenha' component={VisitaSenha} />
            <PrivateRoute path='/relatorios/custodiado/confere' component={RelatorioConfere} />
            <PrivateRoute path='/relatorios/custodiado/populacaocarcerariaResumo' component={PopulacaocarcerariaResumo} />
            <PrivateRoute path='/relatorios/custodiado/depenCrime' component={RelatorioDepenCrime} />
            <PrivateRoute path='/relatorios/custodiado/atendimentoMedico' component={RelatorioAtendimentoMedico} />
            <PrivateRoute path='/relatorios/custodiado/atendimentoMedico/components/linha' component={RelatorioAtendimentoMedicoLinha} />
            <PrivateRoute path='/relatorios/custodiado/vacina' component={RelatorioVacina} />
            <PrivateRoute path='/relatorios/custodiado/medicamento' component={RelatorioMedicamento} />
            <PrivateRoute path='/relatorios/custodiado/patologia' component={RelatorioPatologia} />
            <PrivateRoute path='/relatorios/geralEstatistica' component={RelatorioGeralEstatistica} /> */}

            {/************************************* Domínios *************************************/}
            {/* <PrivateRoute path='/dominio/unidade' component={Unidade} />
            <PrivateRoute path='/dominio/especialidadeMedica' component={EspecialidadeMedica} />
            <PrivateRoute path='/dominio/tipoVacina' component={TipoVacina} />
            <PrivateRoute path='/dominio/medicamento' component={Medicamento} />
            <PrivateRoute path='/dominio/naturezaOcorrencia' component={NaturezaOcorrencia} />            
            <PrivateRoute path='/dominio/patologia' component={Patologia} />
            <PrivateRoute path='/dominio/geral' component={CrudGeralDominio} /> */}

        </React.Fragment>
);

class App extends React.Component {
    render (){
     const { profile, refreshProfile, cleanProfile } = this.props
     const _isAuthenticated = profile ? true : false
     if(!profile && isAuthenticated()) {
         refreshProfile()
         return null
     }
     if(profile && !isAuthenticated()) {
        cleanProfile()
        return null
    }
    
    return (_isAuthenticated ? <MainLayout><Routes /></MainLayout> : <Routes />)
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.login.data,
        fetching: state.login.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(LoginActions.loginCleanMessage()),
    refreshProfile: () => dispatch(LoginActions.loginRefreshProfile()),
    cleanProfile: () => dispatch(LoginActions.loginCleanProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)