import { combineReducers } from 'redux';

const rootReducer = combineReducers({    
    //************************************ Comum ************************************/
    login: require('../pages/login/redux').reducer,
    dashboard: require('../pages/dashboard/redux').reducer,    
    buscaRapida: require('../pages/buscaRapida/redux').reducer,
    alterarSenha: require('../pages/alterarSenha/redux').reducer,    
    
    //************************************ Configuração ************************************/
    mensagemDashboard: require('../pages/configuracao/mensagemDashboard/redux').reducer,  

    //************************************ Controle usuário ************************************/
    sistema: require('../pages/controleUsuario/sistema/redux').reducer,
    modulo: require('../pages/controleUsuario/modulo/redux').reducer,
    menu: require('../pages/controleUsuario/menu/redux').reducer,
    perfil: require('../pages/controleUsuario/perfil/redux').reducer,
    usuario: require('../pages/controleUsuario/usuario/redux').reducer,

    //************************************ Cadastro ************************************/      
    unidadeMedida: require('../pages/cadastro/unidadeMedida/redux').reducer,
    produto: require('../pages/cadastro/produto/redux').reducer,
    condicaoPagamento: require('../pages/cadastro/condicaoPagamento/redux').reducer,
    formaPagamento: require('../pages/cadastro/formaPagamento/redux').reducer,
    cliente: require('../pages/cadastro/cliente/redux').reducer,
    fornecedor: require('../pages/cadastro/fornecedor/redux').reducer,    
    

});

export default rootReducer;
