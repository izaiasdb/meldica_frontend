import apisauce from 'apisauce';
import { getToken, logout } from './authenticationService';
import { get } from 'lodash'
import { URL_BACKEND, URL_FRONTEND } from '../pages/util/constUrlUtils'

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
    logar: async (credenciais) => await api.post('/login/login', credenciais),
    esqueciSenha: async (credenciais) => await api.post('/login/esquecisenha', credenciais),
    alterarSenha: async (credenciais) => await api.post('/login/alterarsenhaesquecida', credenciais)
  }

  const AlterarSenha = {
    salvar: (obj) => api.post('/usuario/alterarsenha', obj),
  }

  const MainLayout = {
    init: (idUsuario) => api.get('/main/init', { idUsuario: idUsuario }),
    //inativarAlerta: (obj) => api.post('/main/inativarAlerta', obj),
    //marcarLido: (obj) => api.post('/main/marcarLido', obj),
  }

  const BuscaRapida = {
    search: (obj) => api.post('/pessoa/buscaRapida', {...obj}),
  }

  //************************************ Dashoboard ************************************/
  const Dashboard = {
    getPopulacaoTotal: () => api.get('/dashboard/populacaocarceraria'),
    getTotalColaboradorPorTipo: () => api.get('/dashboard/totalcolaboradores'),
    getPopulacaoTotalPorUnidade: (unidades) => api.get(`/dashboard/populacaototalporunidade/${unidades}`),
    pesquisarMensagemUnidade: (obj) => api.post('/dashboard/listarmensagensunidade', {...obj}),
    pesquisarVenda: (obj) => api.post('/dashboard/pesquisarVenda', {...obj}),
  }

  //************************************ Configuração ************************************/

  const Configuracao = {
    init: () => api.post('/configuracao/init'),
    salvar: (obj) => api.post('/configuracao/salvar', obj),
    pesquisar: (obj) => api.post('/configuracao/pesquisar', {...obj}),      
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

  //************************************ Cadastro ************************************/
  const UnidadeMedida = {
    init: () => api.post('/unidadeMedida/init'),
    pesquisar: (obj) => api.post('/unidadeMedida/pesquisar', obj),
    salvar: (obj) => api.post('/unidadeMedida/salvar', obj),
  }

  const Produto = {
    init: () => api.post('/produto/init'),
    pesquisar: (obj) => api.post('/produto/pesquisar', obj),
    salvar: (obj) => api.post('/produto/salvar', obj),
  }

  const FormaPagamento = {
    init: () => api.post('/formaPagamento/init'),
    pesquisar: (obj) => api.post('/formaPagamento/pesquisar', obj),
    salvar: (obj) => api.post('/formaPagamento/salvar', obj),
    cancelar: (obj) => api.post('/formaPagamento/cancelar', obj),
  }  

  const CondicaoPagamento = {
    init: () => api.post('/condicaoPagamento/init'),
    pesquisar: (obj) => api.post('/condicaoPagamento/pesquisar', obj),
    salvar: (obj) => api.post('/condicaoPagamento/salvar', obj),
    cancelar: (obj) => api.post('/condicaoPagamento/cancelar', obj),
  }

  const FormaCondicaoPagamento = {
    init: () => api.post('/formaCondicaoPagamento/init'),
    pesquisar: (obj) => api.post('/formaCondicaoPagamento/pesquisar', obj),
    salvar: (obj) => api.post('/formaCondicaoPagamento/salvar', obj),
    cancelar: (obj) => api.post('/formaCondicaoPagamento/cancelar', obj),
  }

  const Cliente = {
    init: () => api.post('/cliente/init'),
    obter: (id) => api.get(`/cliente/${id}`),
    pesquisar: (obj) => api.post('/cliente/pesquisar', obj),
    salvar: (obj) => api.post('/cliente/salvar', obj),
    cancelar: (obj) => api.post('/cliente/cancelar', obj),
  }  
  
  const Fornecedor = {
    init: () => api.post('/fornecedor/init'),
    pesquisar: (obj) => api.post('/fornecedor/pesquisar', obj),
    salvar: (obj) => api.post('/fornecedor/salvar', obj),
  }  

  const PlanoConta = {
    init: () => api.post('/planoConta/init'),
    pesquisar: (obj) => api.post('/planoConta/pesquisar', obj),
    salvar: (obj) => api.post('/planoConta/salvar', obj),
  }  

  const Funcionario = {
    init: () => api.post('/funcionario/init'),
    pesquisar: (obj) => api.post('/funcionario/pesquisar', obj),
    salvar: (obj) => api.post('/funcionario/salvar', obj),
  } 

  const Cargo = {
    init: () => api.post('/cargo/init'),
    pesquisar: (obj) => api.post('/cargo/pesquisar', obj),
    salvar: (obj) => api.post('/cargo/salvar', obj),
  } 

  const Transportadora = {
    init: () => api.post('/transportadora/init'),
    pesquisar: (obj) => api.post('/transportadora/pesquisar', obj),
    salvar: (obj) => api.post('/transportadora/salvar', obj),
  } 

  const TabelaPreco = {
    init: () => api.post('/tabelaPreco/init'),
    pesquisar: (obj) => api.post('/tabelaPreco/pesquisar', obj),
    salvar: (obj) => api.post('/tabelaPreco/salvar', obj),
  }
  
  const Empresa = {
    init: () => api.post('/empresa/init'),
    pesquisar: (obj) => api.post('/empresa/pesquisar', obj),
    salvar: (obj) => api.post('/empresa/salvar', obj),
  } 
  
  const GrupoProduto = {
    init: () => api.post('/grupoProduto/init'),
    pesquisar: (obj) => api.post('/grupoProduto/pesquisar', obj),
    salvar: (obj) => api.post('/grupoProduto/salvar', obj),
  } 

  //************************************ Movimentações ************************************/
  const OrdemServico = {
    init: () => api.post('/ordemServico/init'),
    obter: (id) => api.get(`/ordemServico/${id}`),
    pesquisar: (obj) => api.post('/ordemServico/pesquisar', obj),
    salvar: (obj) => api.post('/ordemServico/salvar', obj),
    alterarStatus: (obj) => api.post('/ordemServico/alterarStatus', obj), 
    //imprimir: (obj) => api.post('/ordemServico/imprimir', {...obj,}),
    imprimir: (obj) => api.post('/ordemServico/imprimir', obj),
    gerarFinanceiro: (id) => api.get(`/ordemServico/gerarfinanceiro/${id}`),
    deletarFinanceiro: (id) => api.get(`/ordemServico/deletarfinanceiro/${id}`),
  }

   //************************************ Financeiro ************************************/
   const ContasReceber = {
    initReceber: () => api.post('/pagarReceber/initReceber'),
    initPagar: () => api.post('/pagarReceber/initPagar'),
    obter: (id) => api.get(`/pagarReceber/${id}`),
    pesquisarReceber: (obj) => api.post('/pagarReceber/pesquisar', {...obj, receitaDespesa: 'R'} ),
    pesquisarPagar: (obj) => api.post('/pagarReceber/pesquisar', {...obj, receitaDespesa: 'D'} ),
    salvar: (obj) => api.post('/pagarReceber/salvar', obj),
    pagar: (obj) => api.post('/pagarReceber/pagar', obj),   
    pagarParte: (obj) => api.post('/pagarReceber/salvarPagarReceberItem', obj),    
    excluir: (obj) => api.post('/pagarReceber/excluir', obj),
    excluirItem: (obj) => api.post('/pagarReceber/excluirItem', obj),
  }

  //************************************ Relatórios ************************************/
  const RelatorioGeral = {
    init: () => api.get('/relatorios/geral/init'),
  }  

  const RelatorioPagarReceber = {
    init: () => api.post('/relatorio/pagarReceber/init'),
    pesquisar: (obj) => api.post('/relatorio/pagarReceber/pesquisar', obj),
  }

  const RelatorioOrdemServico = {
    init: () => api.post('/relatorio/ordemServico/init'),
    pesquisar: (obj) => api.post('/relatorio/ordemServico/relatorioResumoMensal', obj),
    imprimir: (obj) => api.post('/relatorio/ordemServico/imprimiResumoMensal', obj),   
    imprimirListagemVenda: (obj) => api.post('/relatorio/ordemServico/imprimirListagemVenda', obj),  
    imprimirProduzirProduto: (obj) => api.post('/relatorio/ordemServico/imprimirProduzirProduto', obj),  
  }

  return {
    Login,
    AlterarSenha,
    MainLayout,
    Dashboard,
    Configuracao,
    BuscaRapida,    
    Sistema,
    Modulo,
    Menu,
    Perfil,    
    Usuario,
    UnidadeMedida,
    Produto,
    FormaPagamento,
    CondicaoPagamento,
    FormaCondicaoPagamento,
    Cliente,
    Fornecedor,
    PlanoConta,
    Funcionario,
    Cargo,
    OrdemServico,
    Transportadora,
    TabelaPreco,
    Empresa,
    GrupoProduto,
    ContasReceber,
    RelatorioGeral,
    RelatorioPagarReceber,
    RelatorioOrdemServico,
  }
}

export default {
  create
}
