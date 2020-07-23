import { combineReducers } from 'redux';

const rootReducer = combineReducers({    
    //************************************ Comum ************************************/
    login: require('../pages/login/redux').reducer,
    // dashboard: require('../pages/dashboard/redux').reducer,    
    // buscaRapida: require('../pages/buscaRapida/redux').reducer,
    // alterarSenha: require('../pages/alterarSenha/redux').reducer,    
    
    //************************************ Configuração ************************************/
    // mensagemDashboard: require('../pages/mensagemDashboard/redux').reducer,
    // padraoUnidade: require('../pages/configuracao/padraoUnidade/redux').reducer,
    // regraVisita: require('../pages/configuracao/regraVisita/redux').reducer,

    //************************************ Sispen ************************************/
    // custodiado: require('../pages/sispen/custodiado/redux').reducer,
    // visitante: require('../pages/sispen/visitante/redux').reducer,
    // advogado: require('../pages/sispen/advogado/redux').reducer,
    // prestadorServico: require('../pages/sispen/prestadorServico/redux').reducer,
    // movimentacao: require('../pages/sispen/movimentacao/redux').reducer,    
    // ocorrenciaUnidade: require('../pages/sispen/ocorrenciaUnidade/redux').reducer,    
    // fichaCustodiado: require('../pages/ficha/custodiado/redux').reducer,
    // fichaVisita: require('../pages/ficha/visitante/redux').reducer,
    // fichaPessoa: require('../pages/ficha/pessoa/redux').reducer,
    // processo: require('../pages/sispen/processo/redux').reducer,
    // incidencia: require('../pages/sispen/incidencia/redux').reducer,
    // atendimentoMedico: require('../pages/sispen/atendimentoMedico/redux').reducer,
    // questionarioPessoa: require('../pages/sispen/questionarioPessoa/redux').reducer,
    // filaEntradaVisitante: require('../pages/sispen/autorizacaoVisitante/components/filaEntradaVisitante/redux').reducer,
    // filaSaidaVisitante: require('../pages/sispen/autorizacaoVisitante/components/filaSaidaVisitante/redux').reducer,
    // entradaSaidaVisitante: require('../pages/sispen/autorizacaoVisitante/components/entradaSaidaVisitante/redux').reducer,
    // autorizacaoVisitante: require('../pages/sispen/autorizacaoVisitante/redux').reducer,

    //************************************ Controle acesso ************************************/
    // bloqueio: require('../pages/acessoUnidade/bloqueio/redux').reducer,
    // acessoUnidade: require('../pages/acessoUnidade/acessoUnidade/redux').reducer,

    //************************************ Relatórios ************************************/
    // relatorioPopulacaoCarceraria: require('../pages/relatorios/custodiado/populacaoCarceraria/redux').reducer,
    // relatorioPopulacaoCarcerariaLinha: require('../pages/relatorios/custodiado/populacaoCarceraria/components/linha/redux').reducer,
    // relatorioBiometria: require('../pages/relatorios/biometria/custodiadoPorUnidade/redux').reducer,
    // relatorioConfere: require('../pages/relatorios/custodiado/confere/redux').reducer,    
    // relatorioDepenCrime: require('../pages/relatorios/custodiado/depenCrime/redux').reducer,
    // relatorioAtendimentoMedico: require('../pages/relatorios/custodiado/atendimentoMedico/redux').reducer,
    // relatorioAtendimentoMedicoLinha: require('../pages/relatorios/custodiado/atendimentoMedico/components/linha/redux').reducer,
    // relatorioVacina: require('../pages/relatorios/custodiado/vacina/redux').reducer,
    // relatorioVacinaLinha: require('../pages/relatorios/custodiado/vacina/components/linha/redux').reducer,
    // relatorioMedicamento: require('../pages/relatorios/custodiado/medicamento/redux').reducer,
    // relatorioMedicamentoLinha: require('../pages/relatorios/custodiado/medicamento/components/linha/redux').reducer,
    // relatorioPatologia: require('../pages/relatorios/custodiado/patologia/redux').reducer,    
    // relatorioPatologiaLinha: require('../pages/relatorios/custodiado/patologia/components/linha/redux').reducer,
    // visitaSenha: require('../pages/relatorios/visita/visitaSenha/redux').reducer,
    // relatorioPopulacaoCarcerariaResumo: require('../pages/relatorios/custodiado/populacaoCarcerariaResumo/redux').reducer,
    // relatorioGeralEstatistica: require('../pages/relatorios/geralEstatistica/redux').reducer,

    //************************************ Controle usuário ************************************/
    // sistema: require('../pages/controleUsuario/sistema/redux').reducer,
    // modulo: require('../pages/controleUsuario/modulo/redux').reducer,
    // menu: require('../pages/controleUsuario/menu/redux').reducer,
    // perfil: require('../pages/controleUsuario/perfil/redux').reducer,
    // usuario: require('../pages/controleUsuario/usuario/redux').reducer,

    //************************************ Domínio ************************************/      
    // unidade: require('../pages/dominio/unidade/redux').reducer,
    // especialidadeMedica: require('../pages/dominio/especialidadeMedica/redux').reducer,
    // tipoVacina: require('../pages/dominio/tipoVacina/redux').reducer,
    // medicamento: require('../pages/dominio/medicamento/redux').reducer,
    // patologia: require('../pages/dominio/patologia/redux').reducer,
    // naturezaOcorrencia: require('../pages/dominio/naturezaOcorrencia/redux').reducer,
    // crudGeralDominio: require('../pages/dominio/geral/redux').reducer,
});

export default rootReducer;
