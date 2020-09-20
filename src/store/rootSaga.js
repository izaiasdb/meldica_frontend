import { takeLatest, all } from "redux-saga/effects"
import API from "../services/Api";
// import EstatisticasAPI from '../services/EstatisticasApi'

//************************************ Comum ************************************/
import { LoginTypes } from '../pages/login/redux';
import { AlterarSenhaTypes } from '../pages/alterarSenha/redux';
import { DashboardTypes } from '../pages/dashboard/redux';
import { BuscaRapidaTypes } from '../pages/buscaRapida/redux';

import * as Login from '../pages/login/sagas';
import * as AlterarSenha from '../pages/alterarSenha/sagas';
import * as Dashboard from '../pages/dashboard/sagas';
import * as BuscaRapida from '../pages/buscaRapida/sagas';

//************************************ Configuração ************************************/
import { MensagemDashboardTypes } from '../pages/configuracao/mensagemDashboard/redux';

import * as MensagemDashboard from '../pages/configuracao/mensagemDashboard/sagas';

//************************************ Controle usuário ************************************/
import { SistemaTypes } from '../pages/controleUsuario/sistema/redux';
import { ModuloTypes } from '../pages/controleUsuario/modulo/redux';
import { MenuTypes } from '../pages/controleUsuario/menu/redux';
import { PerfilTypes } from '../pages/controleUsuario/perfil/redux';
import { UsuarioTypes } from '../pages/controleUsuario/usuario/redux';

import * as Sistema from '../pages/controleUsuario/sistema/sagas';
import * as Modulo from '../pages/controleUsuario/modulo/sagas';
import * as Menu from '../pages/controleUsuario/menu/sagas';
import * as Perfil from '../pages/controleUsuario/perfil/sagas';
import * as Usuario from '../pages/controleUsuario/usuario/sagas';

//************************************ Cadastro ************************************/
import { UnidadeMedidaTypes } from '../pages/cadastro/unidadeMedida/redux';
import { ProdutoTypes } from '../pages/cadastro/produto/redux';
import { FormaPagamentoTypes } from '../pages/cadastro/formaPagamento/redux';
import { CondicaoPagamentoTypes } from '../pages/cadastro/condicaoPagamento/redux';
import { FormaCondicaoPagamentoTypes } from '../pages/cadastro/formaCondicaoPagamento/redux';
import { ClienteTypes } from '../pages/cadastro/cliente/redux';
import { FornecedorTypes } from '../pages/cadastro/fornecedor/redux';
import { PlanoContaTypes } from '../pages/cadastro/planoConta/redux';
import { FuncionarioTypes } from '../pages/cadastro/funcionario/redux';
import { CargoTypes } from '../pages/cadastro/cargo/redux';

import * as UnidadeMedida from '../pages/cadastro/unidadeMedida/sagas';
import * as Produto from '../pages/cadastro/produto/sagas';
import * as FormaPagamento from '../pages/cadastro/formaPagamento/sagas';
import * as CondicaoPagamento from '../pages/cadastro/condicaoPagamento/sagas';
import * as FormaCondicaoPagamento from '../pages/cadastro/formaCondicaoPagamento/sagas';
import * as Cliente from '../pages/cadastro/cliente/sagas';
import * as Fornecedor from '../pages/cadastro/fornecedor/sagas';
import * as PlanoConta from '../pages/cadastro/planoConta/sagas';
import * as Funcionario from '../pages/cadastro/funcionario/sagas';
import * as Cargo from '../pages/cadastro/cargo/sagas';

//************************************ Movimentações ************************************/
import { OrdemServicoTypes } from '../pages/movimentacao/ordemServico/redux';

import * as OrdemServico from '../pages/movimentacao/ordemServico/sagas';


const api = API.create();

export default function * root () {
    yield all([

        //************************************ Comum ************************************/
        takeLatest(LoginTypes.LOGIN_LOGAR, Login.logar, api),
        takeLatest(LoginTypes.LOGIN_LOGOUT, Login.logout, api),
        takeLatest(LoginTypes.LOGIN_REFRESH_PROFILE, Login.refresh, api),
        takeLatest(LoginTypes.LOGIN_ESQUECI_SENHA, Login.esqueciSenha, api),
        takeLatest(LoginTypes.LOGIN_ALTERAR_SENHA, Login.alterarSenha, api),

        takeLatest(AlterarSenhaTypes.ALTERAR_SENHA_SALVAR, AlterarSenha.salvar, api),

        takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL, Dashboard.getPopulacaoTotal, api),
        takeLatest(DashboardTypes.DASHBOARD_GET_TOTAL_COLABORADOR_POR_TIPO, Dashboard.getTotalColaboradorPorTipo, api),
        takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL_POR_UNIDADE, Dashboard.getPopulacaoTotalPorUnidade, api),
        takeLatest(DashboardTypes.DASHBOARD_PESQUISAR_MENSAGEM_UNIDADE, Dashboard.pesquisarMensagemUnidade, api),        

        takeLatest(BuscaRapidaTypes.BUSCA_RAPIDA_SEARCH, BuscaRapida.search, api),

        //************************************ Configuração ************************************/
        takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_INIT, MensagemDashboard.fetch, api),
        takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_SALVAR, MensagemDashboard.salvar, api),
        takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_PESQUISAR, MensagemDashboard.pesquisar, api),           
        takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_DELETAR, MensagemDashboard.salvar, api),       

        //************************************ Controle usuário ************************************/
        takeLatest(SistemaTypes.SISTEMA_SALVAR, Sistema.salvar, api),
        takeLatest(SistemaTypes.SISTEMA_PESQUISAR, Sistema.pesquisar, api),

        takeLatest(ModuloTypes.MODULO_INIT, Modulo.fetch, api),
        takeLatest(ModuloTypes.MODULO_SALVAR, Modulo.salvar, api),
        takeLatest(ModuloTypes.MODULO_PESQUISAR, Modulo.pesquisar, api),           

        takeLatest(MenuTypes.MENU_INIT, Menu.fetch, api),
        takeLatest(MenuTypes.MENU_SALVAR, Menu.salvar, api),
        takeLatest(MenuTypes.MENU_PESQUISAR, Menu.pesquisar, api),
        takeLatest(MenuTypes.MENU_PESQUISAR_MENU, Menu.pesquisarMenu, api),

        takeLatest(PerfilTypes.PERFIL_INIT, Perfil.fetch, api),
        takeLatest(PerfilTypes.PERFIL_SALVAR, Perfil.salvar, api),
        takeLatest(PerfilTypes.PERFIL_PESQUISAR, Perfil.pesquisar, api),        

        takeLatest(UsuarioTypes.USUARIO_INIT, Usuario.fetch, api),
        takeLatest(UsuarioTypes.USUARIO_SALVAR, Usuario.salvar, api),
        takeLatest(UsuarioTypes.USUARIO_PESQUISAR, Usuario.pesquisar, api),
        takeLatest(UsuarioTypes.USUARIO_GET_PERFIL_PERMISSOES, Usuario.getPerfilPermissoes, api),

        //************************************ Cadastros ************************************/
        takeLatest(UnidadeMedidaTypes.UNIDADE_MEDIDA_SALVAR, UnidadeMedida.salvar, api),
        takeLatest(UnidadeMedidaTypes.UNIDADE_MEDIDA_PESQUISAR, UnidadeMedida.pesquisar, api),    

        takeLatest(ProdutoTypes.PRODUTO_INIT, Produto.fetch, api),
        takeLatest(ProdutoTypes.PRODUTO_SALVAR, Produto.salvar, api),
        takeLatest(ProdutoTypes.PRODUTO_PESQUISAR, Produto.pesquisar, api),
        takeLatest(ProdutoTypes.PRODUTO_PESQUISAR_PRODUTO, Produto.pesquisarProduto, api),        

        takeLatest(FormaPagamentoTypes.FORMA_PAGAMENTO_SALVAR, FormaPagamento.salvar, api),
        takeLatest(FormaPagamentoTypes.FORMA_PAGAMENTO_PESQUISAR, FormaPagamento.pesquisar, api),    

        takeLatest(CondicaoPagamentoTypes.CONDICAO_PAGAMENTO_SALVAR, CondicaoPagamento.salvar, api),
        takeLatest(CondicaoPagamentoTypes.CONDICAO_PAGAMENTO_PESQUISAR, CondicaoPagamento.pesquisar, api),            

        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_INIT, FormaCondicaoPagamento.fetch, api),
        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_SALVAR, FormaCondicaoPagamento.salvar, api),
        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_PESQUISAR, FormaCondicaoPagamento.pesquisar, api),

        takeLatest(ClienteTypes.CLIENTE_INIT, Cliente.fetch, api),
        takeLatest(ClienteTypes.CLIENTE_SALVAR, Cliente.salvar, api),
        takeLatest(ClienteTypes.CLIENTE_PESQUISAR, Cliente.pesquisar, api),        

        takeLatest(FornecedorTypes.FORNECEDOR_INIT, Fornecedor.fetch, api),
        takeLatest(FornecedorTypes.FORNECEDOR_SALVAR, Fornecedor.salvar, api),
        takeLatest(FornecedorTypes.FORNECEDOR_PESQUISAR, Fornecedor.pesquisar, api),        

        takeLatest(PlanoContaTypes.PLANO_CONTA_INIT, PlanoConta.fetch, api),
        takeLatest(PlanoContaTypes.PLANO_CONTA_SALVAR, PlanoConta.salvar, api),
        takeLatest(PlanoContaTypes.PLANO_CONTA_PESQUISAR, PlanoConta.pesquisar, api),                

        takeLatest(FuncionarioTypes.FUNCIONARIO_INIT, Funcionario.fetch, api),
        takeLatest(FuncionarioTypes.FUNCIONARIO_SALVAR, Funcionario.salvar, api),
        takeLatest(FuncionarioTypes.FUNCIONARIO_PESQUISAR, Funcionario.pesquisar, api),                

        takeLatest(CargoTypes.CARGO_INIT, Cargo.fetch, api),
        takeLatest(CargoTypes.CARGO_SALVAR, Cargo.salvar, api),
        takeLatest(CargoTypes.CARGO_PESQUISAR, Cargo.pesquisar, api),                        

        //************************************ Movimentação ************************************/
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_INIT, OrdemServico.fetch, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_SALVAR, OrdemServico.salvar, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_PESQUISAR, OrdemServico.pesquisar, api),                        

    ])
}
