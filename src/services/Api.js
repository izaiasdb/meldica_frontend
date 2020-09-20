import apisauce from 'apisauce';
import { getToken, logout } from './authenticationService';
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
    logar: async (credenciais) => await api.post('/login/login', credenciais),
    esqueciSenha: async (credenciais) => await api.post('/login/esquecisenha', credenciais),
    alterarSenha: async (credenciais) => await api.post('/login/alterarsenhaesquecida', credenciais)
  }

  const AlterarSenha = {
    salvar: (obj) => api.post('/usuario/alterarsenha', obj),
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
  }

  //************************************ Configuração ************************************/

  const MensagemDashboard = {
    salvar: (obj) => api.post('/mensagemdashboard/salvar', obj),
    pesquisar: (obj) => api.post('/mensagemdashboard/pesquisar', {...obj}),      
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
  }  

  const CondicaoPagamento = {
    init: () => api.post('/condicaoPagamento/init'),
    pesquisar: (obj) => api.post('/condicaoPagamento/pesquisar', obj),
    salvar: (obj) => api.post('/condicaoPagamento/salvar', obj),
  }

  const FormaCondicaoPagamento = {
    init: () => api.post('/formaCondicaoPagamento/init'),
    pesquisar: (obj) => api.post('/formaCondicaoPagamento/pesquisar', obj),
    salvar: (obj) => api.post('/formaCondicaoPagamento/salvar', obj),
  }

  const Cliente = {
    init: () => api.post('/cliente/init'),
    pesquisar: (obj) => api.post('/cliente/pesquisar', obj),
    salvar: (obj) => api.post('/cliente/salvar', obj),
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

  //************************************ Movimentações ************************************/
  const OrdemServico = {
    init: () => api.post('/ordemServico/init'),
    pesquisar: (obj) => api.post('/ordemServico/pesquisar', obj),
    salvar: (obj) => api.post('/ordemServico/salvar', obj),
  }

  return {
    Login,
    AlterarSenha,
    Dashboard,
    MensagemDashboard,
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
  }
}

export default {
  create
}
