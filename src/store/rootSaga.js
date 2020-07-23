import { takeLatest, all } from "redux-saga/effects"
import API from "../services/Api";
// import EstatisticasAPI from '../services/EstatisticasApi'

//************************************ Comum ************************************/
import { LoginTypes } from '../pages/login/redux';
// import { AlterarSenhaTypes } from '../pages/alterarSenha/redux';
// import { DashboardTypes } from '../pages/dashboard/redux';
// import { BuscaRapidaTypes } from '../pages/buscaRapida/redux';

import * as Login from '../pages/login/sagas';
// import * as AlterarSenha from '../pages/alterarSenha/sagas';
// import * as Dashboard from '../pages/dashboard/sagas';
// import * as BuscaRapida from '../pages/buscaRapida/sagas';

//************************************ Configuração ************************************/
// import { MensagemDashboardTypes } from '../pages/mensagemDashboard/redux';
// import { PadraoUnidadeTypes } from '../pages/configuracao/padraoUnidade/redux';
// import { RegraVisitaTypes } from '../pages/configuracao/regraVisita/redux';

// import * as PadraoUnidade from '../pages/configuracao/padraoUnidade/sagas';
// import * as RegraVisita from '../pages/configuracao/regraVisita/sagas';

//************************************ Controle usuário ************************************/
// import { SistemaTypes } from '../pages/controleUsuario/sistema/redux';
// import { ModuloTypes } from '../pages/controleUsuario/modulo/redux';
// import { MenuTypes } from '../pages/controleUsuario/menu/redux';
// import { PerfilTypes } from '../pages/controleUsuario/perfil/redux';
// import { UsuarioTypes } from '../pages/controleUsuario/usuario/redux';

// import * as Sistema from '../pages/controleUsuario/sistema/sagas';
// import * as Modulo from '../pages/controleUsuario/modulo/sagas';
// import * as Menu from '../pages/controleUsuario/menu/sagas';
// import * as Perfil from '../pages/controleUsuario/perfil/sagas';
// import * as Usuario from '../pages/controleUsuario/usuario/sagas';

//************************************ Sispen ************************************/
// import { CustodiadoTypes } from '../pages/sispen/custodiado/redux';
// import { VisitanteTypes } from '../pages/sispen/visitante/redux';
// import { AdvogadoTypes } from '../pages/sispen/advogado/redux';
// import { PrestadorServicoTypes } from '../pages/sispen/prestadorServico/redux';
// import { MovimentacaoTypes } from '../pages/sispen/movimentacao/redux';
// import { OcorrenciaUnidadeTypes  } from '../pages/sispen/ocorrenciaUnidade/redux';
// import { FichaCustodiadoTypes } from '../pages/ficha/custodiado/redux';
// import { FichaVisitaTypes } from '../pages/ficha/visitante/redux';
// import { FichaPessoaTypes } from '../pages/ficha/pessoa/redux';
// import { ProcessoTypes  } from '../pages/sispen/processo/redux';
// import { IncidenciaTypes  } from '../pages/sispen/incidencia/redux';
// import { AtendimentoMedicoTypes  } from '../pages/sispen/atendimentoMedico/redux';
// import { QuestionarioPessoaTypes  } from '../pages/sispen/questionarioPessoa/redux';
// import { FilaEntradaVisitanteTypes  } from '../pages/sispen/autorizacaoVisitante/components/filaEntradaVisitante/redux';
// import { FilaSaidaVisitanteTypes  } from '../pages/sispen/autorizacaoVisitante/components/filaSaidaVisitante/redux';
// import { EntradaSaidaVisitanteTypes  } from '../pages/sispen/autorizacaoVisitante/components/entradaSaidaVisitante/redux';
// import { AutorizacaoVisitanteTypes  } from '../pages/sispen/autorizacaoVisitante/redux';

// import * as Custodiado from '../pages/sispen/custodiado/sagas';
// import * as Visitante from '../pages/sispen/visitante/sagas';
// import * as Advogado from '../pages/sispen/advogado/sagas';
// import * as PrestadorServico from '../pages/sispen/prestadorServico/sagas';
// import * as Movimentacao from '../pages/sispen/movimentacao/sagas';
// import * as OcorrenciaUnidade from '../pages/sispen/ocorrenciaUnidade/sagas';
// import * as FichaCustodiado from '../pages/ficha/custodiado/sagas';
// import * as FichaVisita from '../pages/ficha/visitante/sagas';
// import * as FichaPessoa from '../pages/ficha/pessoa/sagas';
// import * as Processo from '../pages/sispen/processo/sagas';
// import * as AtendimentoMedico from '../pages/sispen/atendimentoMedico/sagas';
// import * as Incidencia from '../pages/sispen/incidencia/sagas';
// import * as QuestionarioPessoa from '../pages/sispen/questionarioPessoa/sagas';
// import * as FilaEntradaVisitante from '../pages/sispen/autorizacaoVisitante/components/filaEntradaVisitante/sagas';
// import * as FilaSaidaVisitante from '../pages/sispen/autorizacaoVisitante/components/filaSaidaVisitante/sagas';
// import * as EntradaSaidaVisitante from '../pages/sispen/autorizacaoVisitante/components/entradaSaidaVisitante/sagas';
// import * as AutorizacaoVisitante from '../pages/sispen/autorizacaoVisitante/sagas';

//************************************ Controle acesso ************************************/
// import { BloqueioTypes } from '../pages/acessoUnidade/bloqueio/redux';
// import { AcessoUnidadeTypes } from '../pages/acessoUnidade/acessoUnidade/redux';

// import * as Bloqueio from '../pages/acessoUnidade/bloqueio/sagas';
// import * as AcessoUnidade from '../pages/acessoUnidade/acessoUnidade/sagas';

//************************************ Relatórios ************************************/
// import { RelatorioPopulacaoCarcerariaTypes } from '../pages/relatorios/custodiado/populacaoCarceraria/redux';
// import { RelatorioPopulacaoCarcerariaLinhaTypes } from '../pages/relatorios/custodiado/populacaoCarceraria/components/linha/redux';
// import { RelatorioBiometriaTypes } from '../pages/relatorios/biometria/custodiadoPorUnidade/redux';
// import { VisitaSenhaTypes } from '../pages/relatorios/visita/visitaSenha/redux';
// import { RelatorioConfereTypes } from '../pages/relatorios/custodiado/confere/redux';
// import { RelatorioPopulacaoCarcerariaResumoTypes } from '../pages/relatorios/custodiado/populacaoCarcerariaResumo/redux';
// import { RelatorioDepenCrimeTypes } from '../pages/relatorios/custodiado/depenCrime/redux';
// import { RelatorioAtendimentoMedicoTypes } from '../pages/relatorios/custodiado/atendimentoMedico/redux';
// import { RelatorioAtendimentoMedicoLinhaTypes } from '../pages/relatorios/custodiado/atendimentoMedico/components/linha/redux';
// import { RelatorioVacinaTypes } from '../pages/relatorios/custodiado/vacina/redux';
// import { RelatorioVacinaLinhaTypes } from '../pages/relatorios/custodiado/vacina/components/linha/redux';
// import { RelatorioMedicamentoTypes } from '../pages/relatorios/custodiado/medicamento/redux';
// import { RelatorioMedicamentoLinhaTypes } from '../pages/relatorios/custodiado/medicamento/components/linha/redux';
// import { RelatorioPatologiaTypes } from '../pages/relatorios/custodiado/patologia/redux';
// import { RelatorioPatologiaLinhaTypes } from '../pages/relatorios/custodiado/patologia/components/linha/redux';
// import { RelatorioGeralEstatisticaTypes } from '../pages/relatorios/geralEstatistica/redux';

// import * as RelatorioPopulacaoCarceraria from '../pages/relatorios/custodiado/populacaoCarceraria/sagas';
// import * as RelatorioPopulacaoCarcerariaLinha from '../pages/relatorios/custodiado/populacaoCarceraria/components/linha/sagas';
// import * as RelatorioBiometria from '../pages/relatorios/biometria/custodiadoPorUnidade/sagas';
// import * as VisitaSenha from '../pages/relatorios/visita/visitaSenha/sagas';
// import * as RelatorioConfere from '../pages/relatorios/custodiado/confere/sagas';
// import * as RelatorioPopulacaoCarcerariaResumo from '../pages/relatorios/custodiado/populacaoCarcerariaResumo/sagas';
// import * as RelatorioDepenCrime from '../pages/relatorios/custodiado/depenCrime/sagas';
// import * as RelatorioAtendimentoMedico from '../pages/relatorios/custodiado/atendimentoMedico/sagas';
// import * as RelatorioAtendimentoMedicoLinha from '../pages/relatorios/custodiado/atendimentoMedico/components/linha/sagas';
// import * as RelatorioVacina from '../pages/relatorios/custodiado/vacina/sagas';
// import * as RelatorioVacinaLinha from '../pages/relatorios/custodiado/vacina/components/linha/sagas';
// import * as RelatorioMedicamento from '../pages/relatorios/custodiado/medicamento/sagas';
// import * as RelatorioMedicamentoLinha from '../pages/relatorios/custodiado/medicamento/components/linha/sagas';
// import * as RelatorioPatologia from '../pages/relatorios/custodiado/patologia/sagas';
// import * as RelatorioPatologiaLinha from '../pages/relatorios/custodiado/patologia/components/linha/sagas';
// import * as RelatorioGeralEstatistica from '../pages/relatorios/geralEstatistica/sagas';

// import * as MensagemDashboard from '../pages/mensagemDashboard/sagas';

//************************************ Domínios ************************************/
// import { UnidadeTypes } from '../pages/dominio/unidade/redux';
// import { EspecialidadeMedicaTypes } from '../pages/dominio/especialidadeMedica/redux';
// import { TipoVacinaTypes } from '../pages/dominio/tipoVacina/redux';
// import { MedicamentoTypes } from '../pages/dominio/medicamento/redux';
// import { PatologiaTypes } from '../pages/dominio/patologia/redux';
// import { NaturezaOcorrenciaTypes } from '../pages/dominio/naturezaOcorrencia/redux';
// import { CrudGeralDominioTypes } from '../pages/dominio/geral/redux';

// import * as Unidade from '../pages/dominio/unidade/sagas';
// import * as EspecialidadeMedica from '../pages/dominio/especialidadeMedica/sagas';
// import * as TipoVacina from '../pages/dominio/tipoVacina/sagas';
// import * as Medicamento from '../pages/dominio/medicamento/sagas';
// import * as Patologia from '../pages/dominio/patologia/sagas';
// import * as NaturezaOcorrencia from '../pages/dominio/naturezaOcorrencia/sagas';
// import * as CrudGeralDominio from '../pages/dominio/geral/sagas';

const api = API.create();
//const estatisticasApi = EstatisticasAPI.create();

export default function * root () {
    yield all([

        //************************************ Comum ************************************/
        takeLatest(LoginTypes.LOGIN_LOGAR, Login.logar, api),
        takeLatest(LoginTypes.LOGIN_LOGOUT, Login.logout, api),
        takeLatest(LoginTypes.LOGIN_REFRESH_PROFILE, Login.refresh, api),
        takeLatest(LoginTypes.LOGIN_ESQUECI_SENHA, Login.esqueciSenha, api),
        takeLatest(LoginTypes.LOGIN_ALTERAR_SENHA, Login.alterarSenha, api),

        // takeLatest(AlterarSenhaTypes.ALTERAR_SENHA_SALVAR, AlterarSenha.salvar, api),

        // takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL, Dashboard.getPopulacaoTotal, api),
        // takeLatest(DashboardTypes.DASHBOARD_GET_TOTAL_COLABORADOR_POR_TIPO, Dashboard.getTotalColaboradorPorTipo, api),
        // takeLatest(DashboardTypes.DASHBOARD_GET_POPULACAO_TOTAL_POR_UNIDADE, Dashboard.getPopulacaoTotalPorUnidade, api),
        // takeLatest(DashboardTypes.DASHBOARD_PESQUISAR_MENSAGEM_UNIDADE, Dashboard.pesquisarMensagemUnidade, api),        

        // takeLatest(BuscaRapidaTypes.BUSCA_RAPIDA_SEARCH, BuscaRapida.search, api),

        //************************************ Configuração ************************************/
        // takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_INIT, MensagemDashboard.fetch, api),
        // takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_SALVAR, MensagemDashboard.salvar, api),
        // takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_PESQUISAR, MensagemDashboard.pesquisar, api),           
        // takeLatest(MensagemDashboardTypes.MENSAGEM_DASHBOARD_DELETAR, MensagemDashboard.salvar, api),

        // takeLatest(PadraoUnidadeTypes.PADRAO_UNIDADE_INIT, PadraoUnidade.fetch, api),
        // takeLatest(PadraoUnidadeTypes.PADRAO_UNIDADE_SALVAR, PadraoUnidade.salvar, api),
        // takeLatest(PadraoUnidadeTypes.PADRAO_UNIDADE_PESQUISAR, PadraoUnidade.pesquisar, api),           
        // takeLatest(PadraoUnidadeTypes.PADRAO_UNIDADE_DELETAR, PadraoUnidade.salvar, api),

        // takeLatest(RegraVisitaTypes.REGRA_VISITA_INIT, RegraVisita.fetch, api),
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_SALVAR, RegraVisita.salvar, api),
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_PESQUISAR, RegraVisita.pesquisar, api),           
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_DELETAR, RegraVisita.salvar, api),
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_PESQUISAR_MACROESTRUTURAS, RegraVisita.pesquisarMacroestruturas, api),
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_PESQUISAR_MICROESTRUTURAS, RegraVisita.pesquisarMicroestruturas, api),
        // takeLatest(RegraVisitaTypes.REGRA_VISITA_PESQUISAR_LOCALIZACOES, RegraVisita.pesquisarLocalizacoes, api),

        //************************************ Sispen ************************************/
        // takeLatest(CustodiadoTypes.CUSTODIADO_INIT, Custodiado.fetch, api),
        // takeLatest(CustodiadoTypes.CUSTODIADO_SALVAR, Custodiado.salvar, api),
        // takeLatest(CustodiadoTypes.CUSTODIADO_PESQUISAR, Custodiado.pesquisar, api),
        // takeLatest(CustodiadoTypes.CUSTODIADO_BUSCA_POR_SIMILARIDADE, Custodiado.buscaPorSimilaridade, api),

        // takeLatest(VisitanteTypes.VISITANTE_INIT, Visitante.fetch, api),
        // takeLatest(VisitanteTypes.VISITANTE_SALVAR, Visitante.salvar, api),
        // takeLatest(VisitanteTypes.VISITANTE_PESQUISAR, Visitante.pesquisar, api),
        // takeLatest(VisitanteTypes.VISITANTE_BUSCAR_CUSTODIADO, Visitante.buscarCustodiado, api),

        // takeLatest(AdvogadoTypes.ADVOGADO_INIT, Advogado.fetch, api),
        // takeLatest(AdvogadoTypes.ADVOGADO_SALVAR, Advogado.salvar, api),
        // takeLatest(AdvogadoTypes.ADVOGADO_PESQUISAR, Advogado.pesquisar, api),
        // takeLatest(AdvogadoTypes.ADVOGADO_BUSCAR_CUSTODIADO, Advogado.buscarCustodiado, api),

        // takeLatest(PrestadorServicoTypes.PRESTADOR_SERVICO_INIT, PrestadorServico.fetch, api),
        // takeLatest(PrestadorServicoTypes.PRESTADOR_SERVICO_SALVAR, PrestadorServico.salvar, api),
        // takeLatest(PrestadorServicoTypes.PRESTADOR_SERVICO_PESQUISAR, PrestadorServico.pesquisar, api),
                
        // takeLatest(FichaCustodiadoTypes.FICHA_CUSTODIADO_GET_DADOS, FichaCustodiado.getDados, api),
        // takeLatest(FichaCustodiadoTypes.FICHA_CUSTODIADO_IMPRIMIR, FichaCustodiado.imprimir, api),
                
        // takeLatest(FichaVisitaTypes.FICHA_VISITA_GET_DADOS, FichaVisita.getDados, api),
        // takeLatest(FichaVisitaTypes.FICHA_VISITA_IMPRIMIR, FichaVisita.imprimir, api),

        // takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_DADOS, FichaPessoa.getDados, api),
        // takeLatest(FichaPessoaTypes.FICHA_PESSOA_IMPRIMIR, FichaPessoa.imprimir, api),
        // takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_ADVOGADO, FichaPessoa.getAdvogado, api),
        // takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_PRESTADOR_SERVICO, FichaPessoa.getPrestadorServico, api),
        // takeLatest(FichaPessoaTypes.FICHA_PESSOA_GET_VISITANTE, FichaPessoa.getVisitante, api),

        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_INIT, Movimentacao.fetch, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_SALVAR, Movimentacao.salvar, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_PESQUISAR, Movimentacao.pesquisar, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_PESQUISAR_AUTORIZADO, Movimentacao.pesquisarAutorizados, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_PESQUISAR_PENDENTE, Movimentacao.pesquisarPendentes, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_GET_CUSTODIADOS, Movimentacao.getCustodiados, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_AUTORIZAR, Movimentacao.autorizar, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_NAO_AUTORIZAR, Movimentacao.naoAutorizar, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_CANCELAR, Movimentacao.cancelar, api),
        // takeLatest(MovimentacaoTypes.MOVIMENTACAO_RECEBER, Movimentacao.receber, api),      
        
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_INIT, OcorrenciaUnidade.fetch, api),
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_SALVAR, OcorrenciaUnidade.salvar, api),
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_PESQUISAR, OcorrenciaUnidade.pesquisar, api),        
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_BUSCAR_CUSTODIADO, OcorrenciaUnidade.buscarCustodiado, api),
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_BUSCAR_ADVOGADO, OcorrenciaUnidade.buscarAdvogado, api),
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_BUSCAR_SERVIDOR, OcorrenciaUnidade.buscarServidor, api),
        // takeLatest(OcorrenciaUnidadeTypes.OCORRENCIA_UNIDADE_BUSCAR_VISITANTE, OcorrenciaUnidade.buscarVisitante, api),

        // takeLatest(ProcessoTypes.PROCESSO_INIT, Processo.fetch, api),
        // takeLatest(ProcessoTypes.PROCESSO_SALVAR, Processo.salvar, api),
        // takeLatest(ProcessoTypes.PROCESSO_BUSCAR_ADVOGADO, Processo.buscarAdvogado, api),
        // takeLatest(ProcessoTypes.PROCESSO_BUSCAR_DEFENSOR, Processo.buscarDefensor, api),

        // takeLatest(IncidenciaTypes.INCIDENCIA_INIT, Incidencia.fetch, api),
        // takeLatest(IncidenciaTypes.INCIDENCIA_SALVAR, Incidencia.salvar, api),                

        // takeLatest(AtendimentoMedicoTypes.ATENDIMENTO_MEDICO_INIT, AtendimentoMedico.fetch, api),
        // takeLatest(AtendimentoMedicoTypes.ATENDIMENTO_MEDICO_SALVAR, AtendimentoMedico.salvar, api),        

        // takeLatest(QuestionarioPessoaTypes.QUESTIONARIO_PESSOA_INIT, QuestionarioPessoa.fetch, api),
        // takeLatest(QuestionarioPessoaTypes.QUESTIONARIO_PESSOA_SALVAR, QuestionarioPessoa.salvar, api),   
        
        // takeLatest(FilaEntradaVisitanteTypes.FILA_ENTRADA_VISITANTE_PESQUISAR, FilaEntradaVisitante.pesquisar, api),           

        // takeLatest(FilaSaidaVisitanteTypes.FILA_SAIDA_VISITANTE_PESQUISAR, FilaSaidaVisitante.pesquisar, api),

        // takeLatest(EntradaSaidaVisitanteTypes.ENTRADA_SAIDA_VISITANTE_PESQUISAR, EntradaSaidaVisitante.pesquisar, api),           

        // takeLatest(EntradaSaidaVisitanteTypes.ENTRADA_SAIDA_VISITANTE_AUTORIZAR_ENTRADA, EntradaSaidaVisitante.autorizarEntrada, api),
        // takeLatest(EntradaSaidaVisitanteTypes.ENTRADA_SAIDA_VISITANTE_FALTAR_VISITA, EntradaSaidaVisitante.faltarVisita, api),
        // takeLatest(EntradaSaidaVisitanteTypes.ENTRADA_SAIDA_VISITANTE_CANCELAR_VISITA, EntradaSaidaVisitante.cancelarVisita, api),
        // takeLatest(EntradaSaidaVisitanteTypes.ENTRADA_SAIDA_VISITANTE_SAIR_VISITA, EntradaSaidaVisitante.sairVisita, api),

        // takeLatest(AutorizacaoVisitanteTypes.AUTORIZACAO_VISITANTE_INIT, AutorizacaoVisitante.fetch, api),

        //************************************ Controle acesso ************************************/
        // takeLatest(AcessoUnidadeTypes.ACESSO_UNIDADE_INIT, AcessoUnidade.fetch, api),
        // takeLatest(AcessoUnidadeTypes.ACESSO_UNIDADE_SALVAR, AcessoUnidade.salvar, api),
        // takeLatest(AcessoUnidadeTypes.ACESSO_UNIDADE_PESQUISAR, AcessoUnidade.pesquisar, api),
        // takeLatest(AcessoUnidadeTypes.ACESSO_UNIDADE_PESQUISAR_PESSOA, AcessoUnidade.pesquisarPessoa, api),  

        // takeLatest(BloqueioTypes.BLOQUEIO_INIT, Bloqueio.fetch, api),
        // takeLatest(BloqueioTypes.BLOQUEIO_SALVAR, Bloqueio.salvar, api),
        // takeLatest(BloqueioTypes.BLOQUEIO_PESQUISAR, Bloqueio.pesquisar, api),
        // takeLatest(BloqueioTypes.BLOQUEIO_GET_ACESSOS, Bloqueio.getAcessos, api),
        // takeLatest(BloqueioTypes.BLOQUEIO_GET_UNIDADES_ACESSO, Bloqueio.getUnidadesAcesso, api),

        //************************************ Controle usuário ************************************/
        // takeLatest(SistemaTypes.SISTEMA_SALVAR, Sistema.salvar, api),
        // takeLatest(SistemaTypes.SISTEMA_PESQUISAR, Sistema.pesquisar, api),

        // takeLatest(ModuloTypes.MODULO_INIT, Modulo.fetch, api),
        // takeLatest(ModuloTypes.MODULO_SALVAR, Modulo.salvar, api),
        // takeLatest(ModuloTypes.MODULO_PESQUISAR, Modulo.pesquisar, api),           

        // takeLatest(MenuTypes.MENU_INIT, Menu.fetch, api),
        // takeLatest(MenuTypes.MENU_SALVAR, Menu.salvar, api),
        // takeLatest(MenuTypes.MENU_PESQUISAR, Menu.pesquisar, api),
        // takeLatest(MenuTypes.MENU_PESQUISAR_MENU, Menu.pesquisarMenu, api),

        // takeLatest(PerfilTypes.PERFIL_INIT, Perfil.fetch, api),
        // takeLatest(PerfilTypes.PERFIL_SALVAR, Perfil.salvar, api),
        // takeLatest(PerfilTypes.PERFIL_PESQUISAR, Perfil.pesquisar, api),        

        // takeLatest(UsuarioTypes.USUARIO_INIT, Usuario.fetch, api),
        // takeLatest(UsuarioTypes.USUARIO_SALVAR, Usuario.salvar, api),
        // takeLatest(UsuarioTypes.USUARIO_PESQUISAR, Usuario.pesquisar, api),
        // takeLatest(UsuarioTypes.USUARIO_GET_PERFIL_PERMISSOES, Usuario.getPerfilPermissoes, api),

        //************************************ Relatórios ************************************/
        // takeLatest(RelatorioPopulacaoCarcerariaTypes.RELATORIO_POPULACAO_CARCERARIA_INIT, RelatorioPopulacaoCarceraria.fetch, api),
        // takeLatest(RelatorioPopulacaoCarcerariaTypes.RELATORIO_POPULACAO_CARCERARIA_PESQUISAR, RelatorioPopulacaoCarceraria.pesquisar, api),

        // takeLatest(RelatorioPopulacaoCarcerariaLinhaTypes.RELATORIO_POPULACAO_CARCERARIA_LINHA_PESQUISAR, RelatorioPopulacaoCarcerariaLinha.pesquisar, api),

        // takeLatest(RelatorioBiometriaTypes.RELATORIO_BIOMETRIA_INIT, RelatorioBiometria.fetch, api),
        // takeLatest(RelatorioBiometriaTypes.RELATORIO_BIOMETRIA_PESQUISAR, RelatorioBiometria.pesquisar, api),            

        // takeLatest(VisitaSenhaTypes.VISITA_SENHA_INIT, VisitaSenha.fetch, api),
        // takeLatest(VisitaSenhaTypes.VISITA_SENHA_PESQUISAR, VisitaSenha.pesquisar, api),

        // takeLatest(RelatorioConfereTypes.RELATORIO_CONFERE_INIT, RelatorioConfere.fetch, api),
        // takeLatest(RelatorioConfereTypes.RELATORIO_CONFERE_PESQUISAR, RelatorioConfere.pesquisar, api),
        // takeLatest(RelatorioConfereTypes.RELATORIO_CONFERE_IMPRIMIR, RelatorioConfere.imprimir, api),
        // takeLatest(RelatorioConfereTypes.RELATORIO_CONFERE_IMPRIMIR_MATERIAIS, RelatorioConfere.imprimirMateriais, api),
        // takeLatest(RelatorioConfereTypes.RELATORIO_CONFERE_IMPRIMIR_QUANTITATIVO, RelatorioConfere.imprimirQuantitativo, api),
        
        // takeLatest(RelatorioPopulacaoCarcerariaResumoTypes.RELATORIO_POPULACAO_CARCERARIA_RESUMO_INIT, RelatorioPopulacaoCarcerariaResumo.fetch, api),
        // takeLatest(RelatorioPopulacaoCarcerariaResumoTypes.RELATORIO_POPULACAO_CARCERARIA_RESUMO_PESQUISAR, RelatorioPopulacaoCarcerariaResumo.pesquisar, api),

        // takeLatest(RelatorioDepenCrimeTypes.RELATORIO_DEPEN_CRIME_INIT, RelatorioDepenCrime.fetch, api),
        // takeLatest(RelatorioDepenCrimeTypes.RELATORIO_DEPEN_CRIME_PESQUISAR, RelatorioDepenCrime.pesquisar, api),

        // takeLatest(RelatorioAtendimentoMedicoTypes.RELATORIO_ATENDIMENTO_MEDICO_INIT, RelatorioAtendimentoMedico.fetch, api),
        // takeLatest(RelatorioAtendimentoMedicoTypes.RELATORIO_ATENDIMENTO_MEDICO_PESQUISAR, RelatorioAtendimentoMedico.pesquisar, api),

        // takeLatest(RelatorioAtendimentoMedicoLinhaTypes.RELATORIO_ATENDIMENTO_MEDICO_LINHA_PESQUISAR, RelatorioAtendimentoMedicoLinha.pesquisar, api),

        // takeLatest(RelatorioVacinaTypes.RELATORIO_VACINA_INIT, RelatorioVacina.fetch, api),
        // takeLatest(RelatorioVacinaTypes.RELATORIO_VACINA_PESQUISAR, RelatorioVacina.pesquisar, api),

        // takeLatest(RelatorioVacinaLinhaTypes.RELATORIO_VACINA_LINHA_PESQUISAR, RelatorioVacinaLinha.pesquisar, api),

        // takeLatest(RelatorioMedicamentoTypes.RELATORIO_MEDICAMENTO_INIT, RelatorioMedicamento.fetch, api),
        // takeLatest(RelatorioMedicamentoTypes.RELATORIO_MEDICAMENTO_PESQUISAR, RelatorioMedicamento.pesquisar, api),

        // takeLatest(RelatorioMedicamentoLinhaTypes.RELATORIO_MEDICAMENTO_LINHA_PESQUISAR, RelatorioMedicamentoLinha.pesquisar, api),

        // takeLatest(RelatorioPatologiaTypes.RELATORIO_PATOLOGIA_INIT, RelatorioPatologia.fetch, api),
        // takeLatest(RelatorioPatologiaTypes.RELATORIO_PATOLOGIA_PESQUISAR, RelatorioPatologia.pesquisar, api),

        // takeLatest(RelatorioPatologiaLinhaTypes.RELATORIO_PATOLOGIA_LINHA_PESQUISAR, RelatorioPatologiaLinha.pesquisar, api),

        // takeLatest(RelatorioGeralEstatisticaTypes.RELATORIO_GERAL_ESTATISTICA_INIT, RelatorioGeralEstatistica.fetch, api),

        //************************************ Domínio ************************************/
        // takeLatest(UnidadeTypes.UNIDADE_INIT, Unidade.fetch, api),
        // takeLatest(UnidadeTypes.UNIDADE_SALVAR, Unidade.salvar, api),
        // takeLatest(UnidadeTypes.UNIDADE_PESQUISAR, Unidade.pesquisar, api),           
        // takeLatest(UnidadeTypes.UNIDADE_DELETAR, Unidade.salvar, api),
        
        // takeLatest(EspecialidadeMedicaTypes.ESPECIALIDADE_MEDICA_INIT, EspecialidadeMedica.fetch, api),
        // takeLatest(EspecialidadeMedicaTypes.ESPECIALIDADE_MEDICA_SALVAR, EspecialidadeMedica.salvar, api),
        // takeLatest(EspecialidadeMedicaTypes.ESPECIALIDADE_MEDICA_PESQUISAR, EspecialidadeMedica.pesquisar, api),           
        // takeLatest(EspecialidadeMedicaTypes.ESPECIALIDADE_MEDICA_DELETAR, EspecialidadeMedica.salvar, api),

        // takeLatest(TipoVacinaTypes.TIPO_VACINA_INIT, TipoVacina.fetch, api),
        // takeLatest(TipoVacinaTypes.TIPO_VACINA_SALVAR, TipoVacina.salvar, api),
        // takeLatest(TipoVacinaTypes.TIPO_VACINA_PESQUISAR, TipoVacina.pesquisar, api),           
        // takeLatest(TipoVacinaTypes.TIPO_VACINA_DELETAR, TipoVacina.salvar, api),

        // takeLatest(MedicamentoTypes.MEDICAMENTO_INIT, Medicamento.fetch, api),
        // takeLatest(MedicamentoTypes.MEDICAMENTO_SALVAR, Medicamento.salvar, api),
        // takeLatest(MedicamentoTypes.MEDICAMENTO_PESQUISAR, Medicamento.pesquisar, api),           
        // takeLatest(MedicamentoTypes.MEDICAMENTO_DELETAR, Medicamento.salvar, api),

        // takeLatest(PatologiaTypes.PATOLOGIA_INIT, Patologia.fetch, api),
        // takeLatest(PatologiaTypes.PATOLOGIA_SALVAR, Patologia.salvar, api),
        // takeLatest(PatologiaTypes.PATOLOGIA_PESQUISAR, Patologia.pesquisar, api),           
        // takeLatest(PatologiaTypes.PATOLOGIA_DELETAR, Patologia.salvar, api),

        // takeLatest(NaturezaOcorrenciaTypes.NATUREZA_OCORRENCIA_INIT, NaturezaOcorrencia.fetch, api),
        // takeLatest(NaturezaOcorrenciaTypes.NATUREZA_OCORRENCIA_SALVAR, NaturezaOcorrencia.salvar, api),
        // takeLatest(NaturezaOcorrenciaTypes.NATUREZA_OCORRENCIA_PESQUISAR, NaturezaOcorrencia.pesquisar, api),           
        // takeLatest(NaturezaOcorrenciaTypes.NATUREZA_OCORRENCIA_DELETAR, NaturezaOcorrencia.salvar, api),                        

        // takeLatest(CrudGeralDominioTypes.CRUD_GERAL_DOMINIO_INIT, CrudGeralDominio.fetch, api),

    ])
}
