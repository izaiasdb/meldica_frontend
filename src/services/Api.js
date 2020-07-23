import apisauce from 'apisauce';
import { getToken, logout, getUnidadesAcesso } from './authenticationService';
import { get } from 'lodash'
import { URL_BACKEND, URL_FRONTEND } from '../pages/util/constUtils'

const create = () => {
  const baseURL = URL_BACKEND
  const api = apisauce.create({ baseURL, timeout: 60000 });
  const { axiosInstance : { interceptors: { request, response } } } = api

  request.use(
    (config) => {
      const token = getToken()
      if(token) config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (error) => Promise.reject(error)
  )

  response.use(
    (config) => config,
    (error) => {
      console.log(error)
      let retorno = error && error.response ? {
        motivo : error.response.data.message || error.response.data.apierror.debugMessage || error.response.data.apierror.message, 
        submotivo : error.response.data.apierror ? error.response.data.apierror.subErrors : []
      } : {motivo: "Ocorreu um erro ao tentar conectar ao servidor."};
      
      const status = get(error, 'response.data.status', "")

      if(status === 500 || status === 511) {
        logout();
        window.location.href = URL_FRONTEND + 'login'
      } else if(status === 403) {
        retorno.motivo = "Acesso negado!";
      }
      
      return Promise.reject(error);
    }
  )

  //************************************ Comum ************************************/
  const Login = {
    logar: async (credenciais) => await api.post('/usuario/login', credenciais),
    esqueciSenha: async (credenciais) => await api.post('/usuario/esquecisenha', credenciais),
    alterarSenha: async (credenciais) => await api.post('/usuario/alterarsenhaesquecida', credenciais)
  }

  const AlterarSenha = {
    salvar: (obj) => api.post('/usuario/alterarsenha', obj),
  }

  const BuscaRapida = {
    search: (obj) => api.post('/pessoa/buscaRapida', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  //************************************ Dashoboard ************************************/
  const Dashboard = {
    getPopulacaoTotal: () => api.get('/dashboard/populacaocarceraria'),
    getTotalColaboradorPorTipo: () => api.get('/dashboard/totalcolaboradores'),
    getPopulacaoTotalPorUnidade: (unidades) => api.get(`/dashboard/populacaototalporunidade/${unidades}`),
    pesquisarMensagemUnidade: (obj) => api.post('/dashboard/listarmensagensunidade', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  //************************************ Configuração ************************************/

  const MensagemDashboard = {
    salvar: (obj) => api.post('/mensagemdashboard/salvar', obj),
    pesquisar: (obj) => api.post('/mensagemdashboard/pesquisar', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),      
  }

  const PadraoUnidade = {
    init: () => api.post('/padraounidade/init'),
    salvar: (obj) => api.post('/padraounidade/salvar', obj),
    pesquisar: (obj) => api.get('/padraounidade/listartodos'),      
  }

  const RegraVisita = {
    init: (unidade) => api.get('/regravisita/init', { unidadeId: unidade.id }),
    salvar: (obj) => api.post('/regravisita/salvar', obj),
    pesquisar: (obj) => api.get('/regravisita/listartodos'),
    pesquisarMacroestruturas: (obj) => api.get('/unidadeestrutura/getmacroestruturas', obj),
    pesquisarMicroestruturas: (obj) => api.get('/unidadeestrutura/getmicroestruturas', obj),
    pesquisarLocalizacoes: (obj) => api.get('/unidadeestrutura/getlocalizacoes', obj),      
  }


  //************************************ Sispen ************************************/
  const Custodiado = {
    init: (unidade) => api.get('/custodiado/init', { unidadeId: unidade.id }),
    pesquisar: (custodiado) => api.post('/custodiado/pesquisar', {...custodiado, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    salvar: (custodiado) => api.post('/custodiado/salvar', custodiado),
    buscaPorSimilaridade: (custodiado) => api.post('/custodiado/buscaPorSimilaridade', custodiado),
    buscaRapida: (obj) => api.post('/custodiado/buscaRapida', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}), 
  }

  const Visitante = {
    init: () => api.post('/visitante/init'),
    pesquisar: (visitante) => api.post('/visitante/pesquisar', {...visitante, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),    
    salvar: (visitante) => api.post('/visitante/salvar', visitante),
    getVisitante: (idPessoa) => api.post(`/visitante/obter`, {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    buscaRapida: (obj) => api.post('/visitante/buscaRapida', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  const Advogado = {
    init: () => api.post('/advogado/init'),
    pesquisar: (advogado) => api.post('/advogado/pesquisar', {...advogado, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),    
    salvar: (advogado) => api.post('/advogado/salvar', advogado),
    getAdvogado: (idPessoa) => api.post(`/advogado/obter`, {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    buscaRapida: (obj) => api.post('/advogado/buscaRapida', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  } 
  
  const PrestadorServico = {
    init: () => api.post('/prestadorservico/init'),
    pesquisar: (prestadorServico) => api.post('/prestadorservico/pesquisar', {...prestadorServico, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),    
    salvar: (prestadorServico) => api.post('/prestadorservico/salvar', prestadorServico),
    getPrestadorServico: (idPessoa) => api.post(`/prestadorservico/obter`, {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  } 

  const Colaborador = {
    buscaRapida: (obj) => api.post('/colaborador/buscaRapida', {...obj, tipoPessoa: 'S', unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  } 

  const Movimentacao = {
    init: (unidade) => api.get('/movimentacao/init', { unidadeId: unidade.id }),
    pesquisar: (obj) => api.post('/movimentacao/pesquisar', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    salvar: (obj) => api.post('/movimentacao/salvar', obj),
    getCustodiados: (obj) => api.post('/custodiado/pesquisar', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    autorizar: (movimentacoes) => api.post('/movimentacao/autorizar', movimentacoes),
    naoAutorizar: (movimentacoes) => api.post('/movimentacao/naoautorizar', movimentacoes),
    cancelar: (movimentacoes) => api.post('/movimentacao/cancelar', movimentacoes),
    receber: (movimentacoes) => api.post('/movimentacao/receber', movimentacoes),
  }

  const OcorrenciaUnidade = {
    init: () => api.post('/ocorrenciaUnidade/init'),
    //pesquisar: (obj) => api.post('/ocorrenciaUnidade/pesquisar', {...obj, unidade: getUnidadeAtual()}),    
    pesquisar: (obj) => api.post('/ocorrenciaUnidade/pesquisar', obj),    
    salvar: (obj) => api.post('/ocorrenciaUnidade/salvar', obj)
  } 

  const FichaCustodiado = {
    getDados: (idPessoa) => api.post(`/custodiado/ficha`, {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    imprimir: (idPessoa) => api.post('/custodiado/imprimirficha', {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  const FichaVisita = {
    getDados: (idPessoa) => api.post(`/visitante/ficha`, {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    imprimir: (idPessoa) => api.post('/visitante/imprimirficha', {idPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  const FichaPessoa = {
    getDados: (idPessoa, idTipoPessoa) => api.post(`/pessoa/ficha`, {idPessoa, idTipoPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    imprimir: (idPessoa, idTipoPessoa) => api.post('/pessoa/imprimirficha', {idPessoa, idTipoPessoa, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),    
  }

  const Processo = {
    init: () => api.post('/processo/init'),
    salvar: (obj) => api.post('/processo/salvar', obj),
    buscarAdvogado: (obj) => api.post('/pessoa/buscaRapidaTipo', {...obj, idTipo: 5,  unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    buscarDefensor: (obj) => api.post('/pessoa/buscaRapidaTipo', {...obj, idTipo: 12, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }

  const Incidencia = {
    init: () => api.post('/incidencia/init'),
    salvar: (obj) => api.post('/incidencia/salvar', obj),
  }

  const AtendimentoMedico = {
    init: () => api.post('/atendimentomedico/init'),
    salvar: (obj) => api.post('/atendimentomedico/salvar', obj),
  }

  const QuestionarioPessoa = {
    init: () => api.post('/questionariopessoa/init'),
    salvar: (obj) => api.post('/questionariopessoa/salvar', obj),
  }  

  const FilaEntradaVisitante = {
    pesquisar: (obj) => api.post('/autorizacao/visita/filaentrada', obj),      
  }
  
  const FilaSaidaVisitante = {
    pesquisar: (obj) => api.post('/autorizacao/visita/filasaida', obj),      
  }

  const EntradaSaidaVisitante = {
    pesquisar: (obj) => api.post('/autorizacao/visita/pesquisarvisitaentrada', obj),      
    autorizarEntrada: (obj) => api.post('/autorizacao/visita/autorizarvisita', obj),
    faltarVisita: (obj) => api.post('/autorizacao/visita/faltarvisita', obj),
    cancelarVisita: (obj) => api.post('/autorizacao/visita/cancelarvisita', obj),
    sairVisita: (obj) => api.post('/autorizacao/visita/sairvisita', obj),
  }

  const AutorizacaoVisitante = {
  
  }

  //************************************ Controle usuário ************************************/
  const Sistema = {
    salvar: (obj) => api.post('/sistema/salvar', obj),
    pesquisar: (obj) => api.post('/sistema/pesquisar', obj),    
  }  

  const Modulo = {
    init: () => api.post('/modulo/init'),
    salvar: (obj) => api.post('/modulo/salvar', obj),
    pesquisar: (obj) => api.post('/modulo/pesquisar', obj),    
  }  

  const Menu = {
    init: () => api.post('/menu/init'),
    salvar: (obj) => api.post('/menu/salvar', obj),
    pesquisar: (obj) => api.post('/menu/pesquisar', obj),    
    pesquisarMenu: (id) => api.get(`/menu/pesquisarpornivel/${id}`),
  }  

  const Perfil = {
    init: () => api.post('/perfil/init'),
    salvar: (obj) => api.post('/perfil/salvar', obj),
    pesquisar: (obj) => api.post('/perfil/pesquisar', obj),    
  }  
  
  const Usuario = {
    init: () => api.post('/usuario/init'),
    salvar: (obj) => api.post('/usuario/salvar', obj),
    pesquisar: (obj) => api.post('/usuario/pesquisar', obj),    
    getPerfilPermissoes: (id) => api.get(`/perfilmenu/listarpermissoesporidperfil/${id}`),  
  }

  //************************************ Controle acesso ************************************/
  const Bloqueio = {
    init: () => api.post('/pessoabloqueio/init'),
    pesquisar: (obj) => api.post('/pessoabloqueio/pesquisar', obj),
    salvar: (obj) => api.post('/pessoabloqueio/salvar', obj),
    getAcessos: (obj) => api.post('/pessoabloqueio/acessos', obj),
    getUnidadesAcesso: (obj) => api.post('/acessopessoaunidade/listarunidadesacessodapessoa', obj),    
  }

  const AcessoUnidade = {
    init: () => api.post('/acessopessoaunidade/init'),
    salvar: (obj) => api.post('/acessopessoaunidade/salvar', obj),
    pesquisar: (obj) => api.post('/acessopessoaunidade/pesquisar', obj),    
    pesquisarPessoa: (obj) => api.post('/acessopessoaunidade/pesquisarPessoa', obj),
  }  

  //************************************ Relatórios ************************************/
  const RelatorioPopulacaoCarceraria = {
    init: () => api.post('/relatorios/custodiado/init'),
    pesquisar: (obj) => api.post('/relatorios/custodiado/populacaocarceraria', obj),
  }

  const RelatorioPopulacaoCarcerariaLinha = {
    pesquisar: (obj) => api.post('/relatorios/custodiado/populacaocarcerarialinha', obj),
  }

  const RelatorioBiometria = {
    init: () => api.post('/relatorios/biometria/init'),
    pesquisar: (obj) => api.post('/relatorios/biometria/biometriaPorUnidade', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
  }
  
  const VisitaSenha = {
    init: () => api.post('/relatorios/visita/init'),
    pesquisar: (obj) => api.post('/relatorios/visita/visitasenha', obj),
  }

  const RelatorioConfere = {
    init: () => api.post('/relatorios/confere/init'),
    pesquisar: (obj) => api.post('/relatorios/confere/pesquisar', {...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),
    imprimir: (obj) => api.post('/relatorios/confere/imprimir', obj),
    imprimirMateriais: (obj) => api.post('/relatorios/confere/imprimirMateriais', obj),
    imprimirQuantitativo: (obj) => api.post('/relatorios/confere/imprimirQuantitativo', obj),
  }
  
  const RelatorioPopulacaoCarcerariaResumo = {
    init: () => api.post('/relatorios/custodiado/populacaocarcerariaresumo/init'),
    pesquisar: (obj) => api.post('/relatorios/custodiado/populacaocarcerariaresumo/pesquisar', obj),
  }

  const RelatorioDepenCrime = {
    init: () => api.post('/relatorios/depencrime/init'),
    pesquisar: (obj) => api.post('/relatorios/depencrime/pesquisar', obj),
  }

  const RelatorioAtendimentoMedico = {
    init: () => api.post('/relatorios/atendimentomedico/init'),
    pesquisar: (obj) => api.post('/relatorios/atendimentomedico/pesquisar', obj),
  }

  const RelatorioAtendimentoMedicoLinha = {
    pesquisar: (obj) => api.post('/relatorios/atendimentomedico/pesquisarlinha', obj),
  }

  const RelatorioVacina = {
    init: () => api.post('/relatorios/vacina/init'),
    pesquisar: (obj) => api.post('/relatorios/vacina/pesquisar', obj),
  }
  
  const RelatorioVacinaLinha = {
    pesquisar: (obj) => api.post('/relatorios/vacina/pesquisarlinha', obj),
  }

  const RelatorioMedicamento = {
    init: () => api.post('/relatorios/medicamento/init'),
    pesquisar: (obj) => api.post('/relatorios/medicamento/pesquisar', obj),
  }

  const RelatorioMedicamentoLinha = {
    pesquisar: (obj) => api.post('/relatorios/medicamento/pesquisarlinha', obj),
  }

  const RelatorioPatologia = {
    init: () => api.post('/relatorios/patologia/init'),
    pesquisar: (obj) => api.post('/relatorios/patologia/pesquisar', obj),
  }

  const RelatorioPatologiaLinha = {
    pesquisar: (obj) => api.post('/relatorios/patologia/pesquisarlinha', obj),
  }

  const RelatorioGeralEstatistica = {
    init: () => api.get('/relatorios/geralestatistica/init'),
  }

   //************************************ Domínios ************************************/
  
   const CrudGeralDominio = {
    init: () => api.get('/cadastrobasico/geral/init'),
   }
  
   const Unidade = {
    init: () => api.post('/unidade/init'),
    salvar: (obj) => api.post('/unidade/salvar', obj),
    pesquisar: (obj) => api.post('/unidade/pesquisar',{...obj, unidadesAcesso: getUnidadesAcesso().map(u => u.id)}),      
  }

  const EspecialidadeMedica = {
    init: () => api.post('/tipoespecialidade/init'),
    salvar: (obj) => api.post('/tipoespecialidade/salvar', obj),
    pesquisar: (obj) => api.get('/tipoespecialidade/listartodos'),      
  }

  const TipoVacina = {
    init: () => api.post('/tipovacina/init'),
    salvar: (obj) => api.post('/tipovacina/salvar', obj),
    pesquisar: (obj) => api.get('/tipovacina/listartodos'),      
  }

  const Medicamento = {
    init: () => api.post('/medicamento/init'),
    salvar: (obj) => api.post('/medicamento/salvar', obj),
    pesquisar: (obj) => api.get('/medicamento/listartodos'),      
  }

  const Patologia = {
    init: () => api.post('/patologia/init'),
    salvar: (obj) => api.post('/patologia/salvar', obj),
    pesquisar: (obj) => api.get('/patologia/listartodos'),      
  }

  const NaturezaOcorrencia = {
    init: () => api.post('/naturezaOcorrenciaUnidade/init'),
    salvar: (obj) => api.post('/naturezaOcorrenciaUnidade/salvar', obj),
    pesquisar: (obj) => api.post('/naturezaOcorrenciaUnidade/pesquisar', obj),
    //pesquisar: (obj) => api.get('/naturezaOcorrenciaUnidade/listartodos'),      
  }  

  return {
    Login,
    Dashboard,
    Custodiado,
    Visitante,
    Advogado,    
    PrestadorServico,
    Colaborador,
    BuscaRapida,
    FichaCustodiado,
    FichaVisita,
    FichaPessoa,
    RelatorioBiometria,
    Bloqueio,
    Movimentacao,
    OcorrenciaUnidade,
    AcessoUnidade,
    Sistema,
    Modulo,
    Menu,
    Perfil,
    MensagemDashboard,
    Usuario,
    VisitaSenha,
    RelatorioConfere,
    AlterarSenha,
    RelatorioPopulacaoCarceraria,
    RelatorioPopulacaoCarcerariaLinha,
    RelatorioPopulacaoCarcerariaResumo,
    RelatorioDepenCrime,
    RelatorioAtendimentoMedico,
    RelatorioAtendimentoMedicoLinha,
    RelatorioVacina,
    RelatorioVacinaLinha,
    RelatorioMedicamento,
    RelatorioMedicamentoLinha,
    RelatorioPatologia,
    RelatorioPatologiaLinha,
    RelatorioGeralEstatistica,
    Unidade,
    Processo,
    Incidencia,
    AtendimentoMedico,
    QuestionarioPessoa,
    EspecialidadeMedica,
    TipoVacina,
    Medicamento,
    Patologia,
    NaturezaOcorrencia,
    CrudGeralDominio,  
    PadraoUnidade,  
    RegraVisita, 
    FilaEntradaVisitante,
    FilaSaidaVisitante,
    EntradaSaidaVisitante,
    AutorizacaoVisitante,
  }
}

export default {
  create
}
