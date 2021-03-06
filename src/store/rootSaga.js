import { takeLatest, all } from "redux-saga/effects"
import API from "../services/Api";
// import EstatisticasAPI from '../services/EstatisticasApi'

//************************************ Comum ************************************/
import { LoginTypes } from '../pages/login/redux';
import { AlterarSenhaTypes } from '../pages/alterarSenha/redux';
import { MainLayoutTypes } from '../mainLayout/redux';
import { DashboardTypes } from '../pages/dashboard/redux';
import { BuscaRapidaTypes } from '../pages/buscaRapida/redux';

import * as Login from '../pages/login/sagas';
import * as AlterarSenha from '../pages/alterarSenha/sagas';
import * as MainLayout from '../mainLayout/sagas';
import * as Dashboard from '../pages/dashboard/sagas';
import * as BuscaRapida from '../pages/buscaRapida/sagas';


//************************************ Configuração ************************************/
import { ConfiguracaoTypes } from '../pages/configuracao/redux';

import * as Configuracao from '../pages/configuracao/sagas';

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
import { TransportadoraTypes } from '../pages/cadastro/transportadora/redux';
import { TabelaPrecoTypes } from '../pages/cadastro/tabelaPreco/redux';
import { EmpresaTypes } from '../pages/cadastro/empresa/redux';
import { GrupoProdutoTypes } from '../pages/cadastro/grupoProduto/redux';
import { FichaPessoaTypes } from '../pages/ficha/redux';

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
import * as Transportadora from '../pages/cadastro/transportadora/sagas';
import * as TabelaPreco from '../pages/cadastro/tabelaPreco/sagas';
import * as Empresa from '../pages/cadastro/empresa/sagas';
import * as GrupoProduto from '../pages/cadastro/grupoProduto/sagas';
import * as FichaPessoa from '../pages/ficha/sagas';

//************************************ Movimentações ************************************/
import { OrdemServicoTypes } from '../pages/movimentacao/ordemServico/redux';

import * as OrdemServico from '../pages/movimentacao/ordemServico/sagas';

//************************************ Financeiro ************************************/
import { ContasReceberTypes } from '../pages/financeiro/contasReceber/redux';

import * as ContasReceber from '../pages/financeiro/contasReceber/sagas';

//************************************ Relatórios ************************************/
import { RelatorioGeralTypes } from '../pages/relatorios/geralEstatistica/redux';
import { RelatorioPagarReceberTypes } from '../pages/relatorios/relatorioPagarReceber/redux';
import { RelatorioPagasRecebidasTypes } from '../pages/relatorios/relatorioPagasRecebidas/redux';
import { RelatorioResumoMensalTypes } from '../pages/relatorios/relatorioResumoMensal/redux';
import { RelatorioListagemVendaTypes } from '../pages/relatorios/relatorioListagemVenda/redux';
import { RelatorioProduzirTypes } from '../pages/relatorios/relatorioProduzir/redux';

import * as RelatorioGeral from '../pages/relatorios/geralEstatistica/sagas';
import * as RelatorioPagarReceber from '../pages/relatorios/relatorioPagarReceber/sagas';
import * as RelatorioPagasRecebidas from '../pages/relatorios/relatorioPagasRecebidas/sagas';
import * as RelatorioResumoMensal from '../pages/relatorios/relatorioResumoMensal/sagas';
import * as RelatorioListagemVenda from '../pages/relatorios/relatorioListagemVenda/sagas';
import * as RelatorioProduzir from '../pages/relatorios/relatorioProduzir/sagas';


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

        takeLatest(MainLayoutTypes.MAIN_LAYOUT_INIT, MainLayout.fetch, api),
        //takeLatest(MainLayoutTypes.MAIN_LAYOUT_INATIVAR_ALERTA, MainLayout.inativarAlerta, api),
        //takeLatest(MainLayoutTypes.MAIN_LAYOUT_MARCAR_LIDO, MainLayout.marcarLido, api),

        takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL, Dashboard.getPopulacaoTotal, api),
        takeLatest(DashboardTypes.DASHBOARD_GET_TOTAL_COLABORADOR_POR_TIPO, Dashboard.getTotalColaboradorPorTipo, api),
        takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL_POR_UNIDADE, Dashboard.getPopulacaoTotalPorUnidade, api),
        takeLatest(DashboardTypes.DASHBOARD_PESQUISAR_MENSAGEM_UNIDADE, Dashboard.pesquisarMensagemUnidade, api),
        takeLatest(DashboardTypes.DASHBOARD_PESQUISAR_VENDA, Dashboard.pesquisarVenda, api),    

        takeLatest(BuscaRapidaTypes.BUSCA_RAPIDA_SEARCH, BuscaRapida.search, api),

        //************************************ Configuração ************************************/
        takeLatest(ConfiguracaoTypes.CONFIGURACAO_INIT, Configuracao.fetch, api),
        takeLatest(ConfiguracaoTypes.CONFIGURACAO_SALVAR, Configuracao.salvar, api),
        takeLatest(ConfiguracaoTypes.CONFIGURACAO_PESQUISAR, Configuracao.pesquisar, api),           
        //takeLatest(ConfiguracaoTypes.CONFIGURACAO_DELETAR, Configuracao.salvar, api),       

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
        takeLatest(FormaPagamentoTypes.FORMA_PAGAMENTO_CANCELAR, FormaPagamento.cancelar, api),          

        takeLatest(CondicaoPagamentoTypes.CONDICAO_PAGAMENTO_SALVAR, CondicaoPagamento.salvar, api),
        takeLatest(CondicaoPagamentoTypes.CONDICAO_PAGAMENTO_PESQUISAR, CondicaoPagamento.pesquisar, api),  
        takeLatest(CondicaoPagamentoTypes.CONDICAO_PAGAMENTO_CANCELAR, CondicaoPagamento.cancelar, api),          

        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_INIT, FormaCondicaoPagamento.fetch, api),
        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_SALVAR, FormaCondicaoPagamento.salvar, api),
        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_PESQUISAR, FormaCondicaoPagamento.pesquisar, api),
        takeLatest(FormaCondicaoPagamentoTypes.FORMA_CONDICAO_PAGAMENTO_CANCELAR, FormaCondicaoPagamento.cancelar, api),

        takeLatest(ClienteTypes.CLIENTE_INIT, Cliente.fetch, api),
        takeLatest(ClienteTypes.CLIENTE_OBTER, Cliente.obter, api),
        takeLatest(ClienteTypes.CLIENTE_SALVAR, Cliente.salvar, api),
        takeLatest(ClienteTypes.CLIENTE_CANCELAR, Cliente.cancelar, api),
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
        
        takeLatest(TransportadoraTypes.TRANSPORTADORA_INIT, Transportadora.fetch, api),
        takeLatest(TransportadoraTypes.TRANSPORTADORA_SALVAR, Transportadora.salvar, api),
        takeLatest(TransportadoraTypes.TRANSPORTADORA_PESQUISAR, Transportadora.pesquisar, api),   

        takeLatest(TabelaPrecoTypes.TABELA_PRECO_INIT, TabelaPreco.fetch, api),
        takeLatest(TabelaPrecoTypes.TABELA_PRECO_SALVAR, TabelaPreco.salvar, api),
        takeLatest(TabelaPrecoTypes.TABELA_PRECO_PESQUISAR, TabelaPreco.pesquisar, api),
        takeLatest(TabelaPrecoTypes.TABELA_PRECO_PESQUISAR_PRODUTO, TabelaPreco.pesquisarProduto, api),   

        takeLatest(EmpresaTypes.EMPRESA_INIT, Empresa.fetch, api),
        takeLatest(EmpresaTypes.EMPRESA_SALVAR, Empresa.salvar, api),
        takeLatest(EmpresaTypes.EMPRESA_PESQUISAR, Empresa.pesquisar, api),

        takeLatest(GrupoProdutoTypes.GRUPO_PRODUTO_INIT, GrupoProduto.fetch, api),
        takeLatest(GrupoProdutoTypes.GRUPO_PRODUTO_SALVAR, GrupoProduto.salvar, api),
        takeLatest(GrupoProdutoTypes.GRUPO_PRODUTO_PESQUISAR, GrupoProduto.pesquisar, api),

        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_DADOS, FichaPessoa.getDados, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_IMPRIMIR, FichaPessoa.imprimir, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_CLIENTE, FichaPessoa.getCliente, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_SERVIDOR, FichaPessoa.getServidor, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_TERCEIRIZADO, FichaPessoa.getTerceirizado, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_PRESTADOR_SERVICO, FichaPessoa.getPrestadorServico, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_VISITANTE, FichaPessoa.getVisitante, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_VISITANTE_UNIDADE, FichaPessoa.getVisitanteUnidade, api),
        takeLatest(FichaPessoaTypes.FICHA_PESSOA_ALTERAR_FOTO, FichaPessoa.alterarFoto, api),

        //************************************ Movimentação ************************************/
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_INIT, OrdemServico.fetch, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_OBTER, OrdemServico.obter, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_SALVAR, OrdemServico.salvar, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_PESQUISAR, OrdemServico.pesquisar, api),                        
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_ALTERAR_STATUS, OrdemServico.alterarStatus, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_IMPRIMIR, OrdemServico.imprimir, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_GERAR_FINANCEIRO, OrdemServico.gerarFinanceiro, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_DELETAR_FINANCEIRO, OrdemServico.deletarFinanceiro, api),
        takeLatest(OrdemServicoTypes.ORDEM_SERVICO_OBTER_ULTIMA_COMPRA_CLIENTE, OrdemServico.obterUltimaCompraCliente, api),

        //************************************ Financeiro ************************************/
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_INIT_RECEBER, ContasReceber.initReceber, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_INIT_PAGAR, ContasReceber.initPagar, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_OBTER, ContasReceber.obter, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_SALVAR, ContasReceber.salvar, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_PESQUISAR_RECEBER, ContasReceber.pesquisarReceber, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_PESQUISAR_PAGAR, ContasReceber.pesquisarPagar, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_PAGAR, ContasReceber.pagar, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_PAGAR_PARTE, ContasReceber.pagarParte, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_EXCLUIR, ContasReceber.excluir, api),
        takeLatest(ContasReceberTypes.CONTAS_RECEBER_EXCLUIR_ITEM, ContasReceber.excluirItem, api),

        //************************************ Relatórios ************************************/
        takeLatest(RelatorioGeralTypes.RELATORIO_GERAL_INIT, RelatorioGeral.fetch, api),

        takeLatest(RelatorioPagarReceberTypes.RELATORIO_PAGAR_RECEBER_INIT, RelatorioPagarReceber.fetch, api),
        takeLatest(RelatorioPagarReceberTypes.RELATORIO_PAGAR_RECEBER_PESQUISAR, RelatorioPagarReceber.pesquisar, api),

        takeLatest(RelatorioPagasRecebidasTypes.RELATORIO_PAGAS_RECEBIDAS_INIT, RelatorioPagasRecebidas.fetch, api),
        takeLatest(RelatorioPagasRecebidasTypes.RELATORIO_PAGAS_RECEBIDAS_PESQUISAR, RelatorioPagasRecebidas.pesquisar, api),

        takeLatest(RelatorioResumoMensalTypes.RELATORIO_RESUMO_MENSAL_INIT, RelatorioResumoMensal.fetch, api),
        takeLatest(RelatorioResumoMensalTypes.RELATORIO_RESUMO_MENSAL_PESQUISAR, RelatorioResumoMensal.pesquisar, api),
        takeLatest(RelatorioResumoMensalTypes.RELATORIO_RESUMO_MENSAL_IMPRIMIR, RelatorioResumoMensal.imprimir, api),

        takeLatest(RelatorioListagemVendaTypes.RELATORIO_LISTAGEM_VENDA_INIT, RelatorioListagemVenda.fetch, api),
        takeLatest(RelatorioListagemVendaTypes.RELATORIO_LISTAGEM_VENDA_IMPRIMIR, RelatorioListagemVenda.imprimir, api),

        takeLatest(RelatorioProduzirTypes.RELATORIO_PRODUZIR_INIT, RelatorioProduzir.fetch, api),
        takeLatest(RelatorioProduzirTypes.RELATORIO_PRODUZIR_IMPRIMIR, RelatorioProduzir.imprimir, api),
        
    ])
}
