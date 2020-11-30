import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, InputNumber, Modal } from 'antd'
import { isEqual, isNil, isEmpty, get } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import MenuActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { menu } = this.props
                
                if (menu.id){
                    this.props.cleanTable()
                    this.props.setState(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setMenu(null)
                }
            }

            this.props.cleanMessage()
        }
    }

    // componentDidMount() {
    //     const { state, form: { setFieldsValue }, menu } = this.props        

    //     if(isEqual(state, EDITING)) {
    //         setFieldsValue({ 
    //             menu: {
    //                 ...menu, 
    //                 idPermissoes: menu.idPermissoes ? [...menu.idPermissoes] : [],
    //                 dataInclusao: menu.dataInclusao ? new moment(menu.dataInclusao, 'YYYY-MM-DD') : null,
    //             }
    //          })
    //     }        
    // }

    render() {
        const { 
            fetching,
            keyHandler,
            state,
            form: { getFieldDecorator, getFieldValue },
            modulos = [],
            menus = [],
            permissoes = [],
            menu = {}
        } = this.props
        const { id, idUsuarioInclusao, modulo = {}, 
            idPermissoes = [], nome, authority, ativo, apenasDesenvolvimento, 
            visivelMenu, dataInclusao, nivel, menu: menuFilho = {}, 
            ordem, iconType, link } = menu || {}
        const { id: idModulo } = modulo || {}
        const { id: idMenu } = menuFilho || {}

        let idPermissoesConst = []

        if (idPermissoes) {
            idPermissoes.forEach(c=> {
                idPermissoesConst.push(c)
            })
        }
        
        const menuNivel = getFieldValue("menu.nivel") || nivel
        const idModuloForm = getFieldValue("menu.modulo.id") || idModulo

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'} de menu`) } >
                    { getFieldDecorator("menu.id", { initialValue: isNil(id) ? null : id })(<Input type="hidden" />) }
                    { getFieldDecorator("menu.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao })(<Input type="hidden" />) }
                    <Row gutter={12}>
                        <Col span={ 4 }>
                            <Form.Item label={"Módulo"} >
                                {
                                    getFieldDecorator('menu.modulo.id', {
                                        rules: [{required: true, message: 'Informe o módulo.'}],
                                        initialValue: idModulo || 1
                                    })(
                                    <Select showSearch
                                            optionFilterProp="children"
                                            disabled = {isEqual(state, EDITING)}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            <Select.Option key={1} value={null}>{"Selecione"}</Select.Option>
                                            {generateOptions(modulos.map(({id, nome: descricao}) => ({id, descricao})))}
                                    </Select>
                                    )
                                }                   
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('menu.nome', {
                                        rules: [{ required: true, message: 'Por favor, informe o nome.' }],
                                        initialValue: nome || null
                                    })(
                                        <Input maxLength={ 100 } onKeyUp={keyHandler} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item label={"Authority"}>
                                {
                                    getFieldDecorator('menu.authority', {
                                        rules: [{ required: true, message: 'Por favor, informe a authority.' }],
                                        initialValue: authority || null
                                    })(
                                        <Input maxLength={ 100 } onKeyUp={keyHandler} />
                                    )
                                }
                            </Form.Item>
                        </Col>                        
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('menu.ativo', {
                                    initialValue: isNil(ativo) ? true : ativo,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>    
                    </Row>
                    <Row gutter={12}> 
                        <Col span={ 3 }>
                            <Form.Item label={"Apenas dev."}>
                            {
                                getFieldDecorator('menu.apenasDesenvolvimento', {
                                    initialValue: isNil(apenasDesenvolvimento) ? false : apenasDesenvolvimento,                                    
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                          
                        <Col span={ 3 }>
                            <Form.Item label={"Visível no menu"}>
                            {
                                getFieldDecorator('menu.visivelMenu', {
                                    initialValue: isNil(visivelMenu) ? true : visivelMenu,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                              
                        <Col span={ 3 }>
                            <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                                {
                                    getFieldDecorator('menu.dataInclusao', {
                                        rules: [{required: false}],
                                        initialValue: dataInclusao ? new moment(dataInclusao) : new moment(),
                                    })(<DatePicker format={'DD/MM/YYYY'} disabled />)
                                }                                
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>                      
                        <Col span={ 2 }>
                            <Form.Item label={"Nível"}>
                            {
                                getFieldDecorator('menu.nivel', {
                                    rules: [{ required: true, message: "Por favor, informe o nível."}],
                                    initialValue: nivel || null,
                                })(
                                    <InputNumber style={{ width: '100%'}} 
                                                max={300} 
                                                min={0} 
                                                maxLength={3}
                                                formatter={value => new String(value).replace(/([a-zA-Z]*)/g,'') } />
                                )
                            }                                
                            </Form.Item>                            
                        </Col>       
                        <Col span={ 4 }>
                            <Form.Item label={"Menu"}>
                            {
                                getFieldDecorator('menu.menu.id', {
                                    rules: [{required: false, message: 'Informe o menu.'}],
                                    initialValue: idMenu || null,
                                })(
                                <Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Select.Option key={2} value={null}>{"Selecione"}</Select.Option>
                                        {generateOptions(menuNivel && idModuloForm && menuNivel > 1 && menus.filter(c => c.nivel == menuNivel - 1 && c.modulo.id == idModuloForm).map(({id, nome: descricao}) => ({id, descricao})))}
                                </Select>
                                )
                            }                                
                            </Form.Item>                            
                        </Col>                                            
                        <Col span={ 2 }>
                            <Form.Item label={"Ordem"}>
                            {
                                getFieldDecorator('menu.ordem', {
                                    rules: [{ required: true, message: "Por favor, informe a ordem."}],
                                    initialValue: ordem || null,
                                })(
                                    <InputNumber style={{ width: '100%'}} 
                                                max={300} 
                                                min={0} 
                                                maxLength={3}
                                                formatter={value => new String(value).replace(/([a-zA-Z]*)/g,'') } />
                                )
                            }
                            </Form.Item>                            
                        </Col> 
                        <Col span={ 7 }>
                            <Form.Item label={"Permissões"}>
                            {
                                getFieldDecorator('menu.idPermissoes', {    
                                    initialValue: idPermissoesConst                     
                                })(
                                <Select placeholder={"Todos"} 
                                        mode={'multiple'}
                                        optionFilterProp="children"
                                        allowClear>
                                        {generateOptions(permissoes.map(({id, descricao}) => ({id, descricao})))}
                                </Select>
                                )                                
                            }                                
                            </Form.Item>                            
                        </Col>                                                 
                    </Row>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item label={"Tipo do Ícone"}>
                                    {
                                        getFieldDecorator('menu.iconType', {       
                                            rules: [{ required: true, message: 'Por favor, informe o tipo do ícone.' }],
                                            initialValue: iconType || null,
                                        })(
                                            <Input maxLength={ 60 } onKeyUp={keyHandler} />
                                        )  
                                    } 
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={"Link"}>
                                {
                                    getFieldDecorator('menu.link', {       
                                        rules: [{ required: false, message: 'Por favor, informe o link.' }],
                                        initialValue: link || null,
                                    })(
                                        <Input maxLength={ 255 } onKeyUp={keyHandler} />
                                    )  
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{textAlign: "right"}}>
                        <Button type={ "primary"} 
                                onClick={this.voltar}
                                style={{marginRight: '10px'}}>
                                Voltar
                        </Button>
                        <Button type={"primary"} 
                                htmlType={"submit"} 
                                onClick={this.handleSubmit}>
                            { this.isSaving() ? 'Salvar' : 'Atualizar' }
                        </Button>
                    </Row>                    
                </Card>
            </Form>
        </Spin>
        )
    }

    isSaving = () => isEqual(this.props.state, INSERTING)

    voltar = () => {
        const { confirm } = Modal;
        const { setState } = this.props;

        confirm({
            title: 'Tem certeza que deseja sair?',
            content: 'Os dados informados serão perdidos.',
            onOk() {
                setState(SEARCHING);
            },
            onCancel() {
              console.log('Cancelar');
            },
        });
    }

    keyHandler = ({key}) => { 
        switch (key) {
            case 'Enter':
                this.handleSubmit()
                break;
            case 'Escape':
                this.voltar();
                break;
            default: break;
        }
    }

    handleReset = () => {
        this.props.form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { menu }) => {
            if (!err) {
                this.props.setMenu(menu)
                this.props.salvar(menu)

                // if (this.isSaving()) {
                //     this.handleReset()
                //     this.props.setState(SEARCHING)
                //     this.props.cleanTable()
                // } else {
                //     this.props.cleanTable()
                //     //this.voltar()
                //     this.props.setState(SEARCHING)
                // }
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.menu.data,
        menu: state.menu.menu,
        state: state.menu.state,
        fetching: state.menu.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(MenuActions.menuCleanMessage()),
    cleanTable: () => dispatch(MenuActions.menuCleanTable()),
    setState: (state) => dispatch(MenuActions.menuSetState(state)),
    salvar: (obj) => dispatch(MenuActions.menuSalvar(obj)),
    pesquisarMenu: (obj) => dispatch(MenuActions.pesquisarMenu(obj)),  
    setMenu: (menu) => dispatch(MenuActions.menuSetMenu(menu)),     
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)