import React, { Component } from 'react'
import { Row, Col, Tree, Select, Icon, Switch, Form  } from 'antd'
import { connect } from 'react-redux'
import UsuarioActions from '../redux'
import { getUser } from '../../../../services/authenticationService'

const { TreeNode } = Tree;

class TabMenu extends Component {

    constructor(props){
        super(props)
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            //checkedKeys: ['0-0-0-1'],
            selectedKeys: [],
            showLine: true,
            showIcon: false,
        };
    }

    UNSAFE_componentWillMount() {
        this.montarMenu();
    }    

    UNSAFE_componentWillReceiveProps(nextProps){
        this.montarMenu();
    }

    componentDidMount() {

    }    

    montarMenu = () => {
        const { checkedKeys, menus = [] } = this.props;        
        const { expandedKeys } = this.state;

        menus.map((menu, i) => {
            expandedKeys.push(menu.key);

            menu.children.map((nivel2, i) => {
                expandedKeys.push(nivel2.key);

                nivel2.children.map((nivel3, i) => {
                    expandedKeys.push(nivel3.key);
                })                
            })
        })

        this.setState({ checkedKeys, expandedKeys });
    }

    obterMenu = () => {
        const {  menus = [] } = this.props   
        const { desenvolvedor, menus: menusUsuario } = getUser()

        if (desenvolvedor) {
            return menus
        } else {
            return menusUsuario
        }
    }

    render()  {
        // {  menus = [], } = this.props   
        const { showIcon, showLine, expandedKeys } = this.state;

        let menus = this.obterMenu()

        return (
            <div>              
                <Row gutter={24}>
                    <Col span={ 24 }>
                        {/* <div style={{ marginBottom: 16 }}>
                            Mostrar linha: <Switch checked={showLine} onChange={this.onShowLineChange} />
                            <br />
                            <br />
                            Mostrar ícone: <Switch checked={showIcon} onChange={this.onShowIconChange} />
                        </div>   */}
                        <Tree                        
                            checkable
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}                            
                            showLine={showLine}
                            showIcon={showIcon}                            
                            >
                            {this.renderTreeNodes(menus)}
                        </Tree>
                    </Col>
                </Row>
            </div>
        )        
    }   

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };       

    // Evento acionado antes de marcar
    onCheck = checkedKeys => {
        this.setState({ checkedKeys }, () => this.props.setCheckedKeys(this.state.checkedKeys));
    };

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };    

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} />;
    });
    
    onShowLineChange = showLine => {
        this.setState({ showLine });
    }
    
    onShowIconChange = showIcon => {
        this.setState({ showIcon });
    }    
}

const mapStateToProps = (state) => {
    return {
        ...state.usuario.data,
        profile: state.login.data.profile,      
        usuario: state.usuario.usuario,
        state: state.usuario.state,
        checkedKeys: state.usuario.checkedKeys,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(UsuarioActions.usuarioSetState(state)),
    setCheckedKeys: (state) => dispatch(UsuarioActions.usuarioSetCheckedKeys(state)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabMenu)