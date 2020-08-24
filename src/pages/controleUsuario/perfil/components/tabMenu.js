import React, { Component } from 'react'
import { Row, Col, Tree, Select, Icon, Switch, Form  } from 'antd'
import { connect } from 'react-redux'
import PerfilActions from '../redux'

const { TreeNode } = Tree;

class TabMenu extends Component {

    constructor(props){
        super(props)
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            selectedKeys: [],
            showLine: true,
            showIcon: false,
        };
    }

    UNSAFE_componentWillMount() {
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

    componentDidMount() {

    }    

    render()  {
        const {  menus = [], } = this.props   
        const { showIcon, showLine } = this.state;

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
                            expandedKeys={this.state.expandedKeys}
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
        ...state.perfil.data,
        perfil: state.perfil.perfil,
        state: state.perfil.state,
        checkedKeys: state.perfil.checkedKeys,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setState: (state) => dispatch(PerfilActions.perfilSetState(state)),
    setCheckedKeys: (state) => dispatch(PerfilActions.perfilSetCheckedKeys(state)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabMenu)