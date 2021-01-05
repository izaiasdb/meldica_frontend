import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import MainLayout from './mainLayout'
import LoginActions from './pages/login/redux'
import { isAuthenticated } from './services/authenticationService';

//************************************ Comum ************************************/
import Login from './pages/login/login'
import AlterarSenha from './pages/login/alterarSenha'
import Dashboard from './pages/dashboard/container/dashboard'

import Configuracao from './pages/configuracao/container/configuracao'

//************************************ Controle usuário ************************************/
import Sistema from './pages/controleUsuario/sistema/container/sistema'
import Modulo from './pages/controleUsuario/modulo/container/modulo'
import Menu from './pages/controleUsuario/menu/container/menu'
import Perfil from './pages/controleUsuario/perfil/container/perfil'
import Usuario from './pages/controleUsuario/usuario/container/usuario'

//************************************ Cadastro ************************************/
import UnidadeMedida from './pages/cadastro/unidadeMedida/container/unidadeMedida'
import Produto from './pages/cadastro/produto/container/produto'
import CondicaoPagamento from './pages/cadastro/condicaoPagamento/container/condicaoPagamento'
import FormaPagamento from './pages/cadastro/formaPagamento/container/formaPagamento'
import FormaCondicaoPagamento from './pages/cadastro/formaCondicaoPagamento/container/formaCondicaoPagamento'
import Cliente from './pages/cadastro/cliente/container/cliente'
import Fornecedor from './pages/cadastro/fornecedor/container/fornecedor'
import PlanoConta from './pages/cadastro/planoConta/container/planoConta'
import Funcionario from './pages/cadastro/funcionario/container/funcionario'
import Cargo from './pages/cadastro/cargo/container/cargo'
import Transportadora from './pages/cadastro/transportadora/container/transportadora'
import TabelaPreco from './pages/cadastro/tabelaPreco/container/tabelaPreco'
import Empresa from './pages/cadastro/empresa/container/empresa'
import GrupoProduto from './pages/cadastro/grupoProduto/container/grupoProduto'

//************************************ Movimentação ************************************/
import OrdemServico from './pages/movimentacao/ordemServico/container/ordemServico'

//************************************ Financeiro ************************************/
import ContasReceber from './pages/financeiro/contasReceber/container/contasReceber'
import ContasPagar from './pages/financeiro/contasReceber/container/contasPagar'

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
            <Route exact path='/alterarSenha' component={AlterarSenha} />
            <PrivateRoute exact path='/' component={Dashboard} />
            <PrivateRoute path='/dashboard' component={Dashboard} />

            {/************************************* Configuração *************************************/}
            <PrivateRoute path='/configuracao' component={Configuracao} />

            {/************************************* Controle usuário *************************************/}
            <PrivateRoute path='/controle/sistema' component={Sistema} />
            <PrivateRoute path='/controle/modulo' component={Modulo} />
            <PrivateRoute path='/controle/menu' component={Menu} />
            <PrivateRoute path='/controle/perfil' component={Perfil} />
            <PrivateRoute path='/controle/usuario' component={Usuario} />

            {/************************************* Cadastro *************************************/}
            <PrivateRoute path='/cadastro/unidadeMedida' component={UnidadeMedida} />
            <PrivateRoute path='/cadastro/produto' component={Produto} />
            <PrivateRoute path='/cadastro/formaPagamento' component={FormaPagamento} />
            <PrivateRoute path='/cadastro/condicaoPagamento' component={CondicaoPagamento} />
            <PrivateRoute path='/cadastro/formaCondicaoPagamento' component={FormaCondicaoPagamento} />
            <PrivateRoute path='/cadastro/cliente' component={Cliente} />
            <PrivateRoute path='/cadastro/fornecedor' component={Fornecedor} />
            <PrivateRoute path='/cadastro/planoConta' component={PlanoConta} />
            <PrivateRoute path='/cadastro/funcionario' component={Funcionario} />
            <PrivateRoute path='/cadastro/cargo' component={Cargo} />
            <PrivateRoute path='/cadastro/transportadora' component={Transportadora} />
            <PrivateRoute path='/cadastro/tabelaPreco' component={TabelaPreco} />
            <PrivateRoute path='/cadastro/empresa' component={Empresa} />
            <PrivateRoute path='/cadastro/grupoProduto' component={GrupoProduto} />

            {/************************************* Movimentações *************************************/}
            <PrivateRoute path='/movimentacao/venda' component={OrdemServico} />     

            {/************************************* Financeiro *************************************/}
            <PrivateRoute path='/financeiro/contasReceber' component={ContasReceber} />            
            <PrivateRoute path='/financeiro/contasPagar' component={ContasPagar} />            

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