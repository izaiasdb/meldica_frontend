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

import MensagemDashboard from './pages/configuracao/mensagemDashboard/container/mensagemDashboard'

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
import Cliente from './pages/cadastro/cliente/container/cliente'
import Fornecedor from './pages/cadastro/fornecedor/container/fornecedor'


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
            <PrivateRoute path='/configuracao/mensagemDashboard' component={MensagemDashboard} />

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
            <PrivateRoute path='/cadastro/cliente' component={Cliente} />
            <PrivateRoute path='/cadastro/fornecedor' component={Fornecedor} />
           

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