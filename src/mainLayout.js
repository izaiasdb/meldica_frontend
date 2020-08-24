import React, { Component } from 'react'
import { Layout, Menu, Icon, Popover, Avatar, Select, Modal, Button } from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './assets/css/topo.css'
import logo from './assets/images/logo.png';
import { getUser, getUnidadesAcesso } from './services/authenticationService';
// import BuscaRapida from './pages/buscaRapida/buscaRapida';
import LoginActions from './pages/login/redux'
import { generateOptions } from './pages/util/helper'
import { Redirect, withRouter } from 'react-router-dom'
// import AlterarSenha from './pages/alterarSenha/alterarSenha'
// import AlterarSenhaActions from './pages/alterarSenha/redux'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

class MainLayout extends Component {
  state = {
    collapsed: false,
    selectedKey: '1',
  };  

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  getContent = () => {
    const { logout } = this.props

    return (<div >      
      <Button type="link"
        onClick = { (e) => this.showModal() }
        icon="edit"
        style={{marginLeft: '-15px'}} >
        Alterar senha        
      </Button>
      <br/>      
      <Link to="/login" onClick = { () => { logout(); setUnidadeAtual() } }>
        <Icon type={ 'logout' }></Icon>
        &nbsp;&nbsp;Sair
      </Link>
    </div>)
  }

  showModal = () => {
    this.props.setVisivel(true);
  };

  getMenuItem = ({id, iconType, nome, link}) => {
    return <Menu.Item key={id} onClick={() => this.setState({selectedKey: id})} >
              <Icon type={iconType} />
              <span style={{fontWeight: 'bold'}}>{nome}</span>
              <Link to={link == null ? '': link} />
           </Menu.Item>
  }

  handleSelectChange = (id, { props: { children : abreviacao} }) => {
    this.props.setUnidadeAtual({id, abreviacao})
    this.props.history.push("/");
  }

  getUnidade = () => {
    const unidades = getUnidadesAcesso() || []
    const { profile = {} } = this.props
    const { unidadeAtual = {} } = profile
    return (<Select value={unidadeAtual.id || null} showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onSelect={this.handleSelectChange}
                    style={{'width': '200px'}}>
                {generateOptions(unidades && unidades.map(({id, abreviacao: descricao}) => ({id, descricao})))}
        </Select>)
  }

  getMenusFilho = (menus = [], menuId = null) => {    
    return menus.filter(m => m.menu.id  == menuId)
                .sort((a, b) => a.ordem-b.ordem)
                .map(m => {
                  let children = menus.filter(m => m.menu.nivel == (m.nivel + 1))
                  let subMenu = children.length > 0 ? this.getMenusFilho(children, m.id) : []
                  const menu = {...m, subMenu }
                  return menu
                })
  }

  montarMenu = () => {
    const { desenvolvedor } = getUser()
    const { profile = {} } = this.props
    const { usuarioMenuList = [] } = profile    
    let menus = usuarioMenuList == null ? [] : [...usuarioMenuList].map(({menu}) => menu)
    let childrenMenus = null;
    
    // Menus que só desenvolvedores podem ver
    if (desenvolvedor) {
      childrenMenus = menus.filter(m => m.menu != null && m.ativo && m.ativo)
    } else {
      childrenMenus = menus.filter(m => m.menu != null && m.ativo && !m.apenasDesenvolvimento)
    }    

    const rootMenus = menus.filter(m => m.menu == null && m.ativo).sort((a, b) => a.ordem-b.ordem)
    const menuMontado = rootMenus.map(rm => {
      const rootMenu = {...rm, subMenu: this.getMenusFilho(childrenMenus, rm.id) || []}
      return this.getSubMenu(rootMenu)
    })

    return menuMontado
  }

  getSubMenu = (menu) => {
    const { id, iconType, nome, subMenu = [] } = menu
    if(menu.subMenu.length == 0) return this.getMenuItem(menu)
    return (
      <SubMenu key={id} 
               style={{fontWeight: 'bold'}}
               title={ <span><Icon type={iconType} /><span>{nome}</span></span> }>
               {
                  subMenu.map(sm => this.getSubMenu(sm))
               } 
      </SubMenu>)  
  } 

  render() {
    const { nome, login } = getUser()
    return (
      <div>
      <Layout>
        <Header style={{ background: '#fff', 'borderBottom' : '3px solid #f36a21', padding: '0' }} >
            <div className={"topo"}>
              <Link to="/dashboard">
                <div className={"boxLogo"}><img src={logo} /></div>
              </Link>
              <div className={"nomeTopo"} >
                {/* Méldica */}
                </div>
              {/* <BuscaRapida /> */}              
              <div className={"userTopo"} >
                <Popover placement="bottom" title={nome} content={this.getContent()}>
                  <Avatar size="small" icon="user" style={ { backgroundColor: '#149647'}} />
                  <span style={{padding: '5px'}}><b>{login}</b></span>
                </Popover>
              </div>
            </div>
        </Header>
        <Layout>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
            <Menu theme="dark" selectedKeys={[this.state.selectedKey]} mode="inline">
              { this.montarMenu() }
            </Menu>
          </Sider>
          <Content className={"content"}>
              { this.props.children }
          </Content>
        </Layout>
        <Footer className={"nomeRodape"} style={{ textAlign: 'center', padding: 0, height: '48px'}}>
          <p>        
            <b>Méldica - Fábrica de produtos naturais</b><br/>
            R. Francisco Morais Moreira, 1100, Conj. Cidade Nova, Icó-CE - CEP: 63430-000 Fone: (88) 3561-1827<br/>
            © - IDB Sistemas - (85) 99828-7508. Todos os Direitos Reservados
          </p>
        </Footer>
      </Layout>

      {/* <AlterarSenha /> */}
      </div>
    );  
    }
}

const mapStateToProps = (state) => {

  return {
      ...state.login.data,
      profile: state.login.data.profile,      
      fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => ({
  cleanMessage: ()  => dispatch(LoginActions.loginCleanMessage()),
  logout: () => dispatch(LoginActions.loginLogout()),
  setUnidadeAtual: (unidadeAtual) => dispatch(LoginActions.loginSetUnidadeAtual(unidadeAtual)),
  // setVisivel: (visibilidade) => dispatch(AlterarSenhaActions.alterarSenhaSetVisivel(visibilidade)),  
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainLayout))