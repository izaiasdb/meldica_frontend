import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Input, DatePicker, Switch, Modal } from 'antd'
import { isEqual, get } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { openNotification } from '../../../util/notification'
import SistemaActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    getTitle = () => {
        return (
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                { 
                    `${this.isSaving() ? 'Cadastro' : 'Edição'} de sistema`
                }
            </span>
        )
    }

    componentDidMount() {
        const { state, form: { setFieldsValue }, sistema } = this.props        

        if(isEqual(state, EDITING)) {
            setFieldsValue({ 
                sistema: {
                    ...sistema,
                    dataInclusao: sistema.dataInclusao ? new moment(sistema.dataInclusao, 'YYYY-MM-DD') : null,
                }
             })
        }        
    }

    render() {
        const { 
            fetching,
            keyHandler,
            form: { getFieldDecorator }
        } = this.props
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ this.getTitle() } >
                    { getFieldDecorator("sistema.id", { initialValue: null })(<Input type="hidden" />) }
                    { getFieldDecorator("sistema.idUsuarioInclusao", { initialValue: null })(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Col span={ 8 }>
                            <Form.Item label={"Nome"}>
                            {
                                getFieldDecorator('sistema.nome', {
                                    rules: [{ required: true, message: 'Por favor, informe o nome.' }]
                                })(
                                    <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                                )
                            }
                            </Form.Item>
                        </Col>
                        <Col span={ 4 }>
                            <Form.Item label={"Abreviado"}>
                            {
                                getFieldDecorator('sistema.abreviado', {
                                    rules: [{ required: true, message: 'Por favor, informe a abreviação.' }]
                                })(
                                    <Input maxLength={ 20 } onKeyUp={keyHandler} onInput={toInputUppercase}/>
                                )
                            }
                            </Form.Item>
                        </Col>
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('sistema.ativo', {
                                    initialValue: true,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch checkedChildren="SIM" unCheckedChildren="NÃO"/>
                                )
                            }
                            </Form.Item>
                        </Col>                        
                        <Col span={ 4 }>
                            <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                                {
                                    getFieldDecorator('sistema.dataInclusao', {
                                        rules: [{required: false}],
                                        initialValue: new moment(),
                                    })(<DatePicker format={'DD/MM/YYYY'} disabled />)
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
                                //htmlType={"submit"} 
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
        this.props.form.validateFields((err, { sistema }) => {
            if (!err) {
                this.props.salvar(sistema)

                if (this.isSaving()) {
                    this.handleReset()
                    this.props.setState(SEARCHING)
                } else {
                    this.props.cleanTable()
                    this.props.setState(SEARCHING)
                }
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };
    
}

const mapStateToProps = (state) => {

    return {
        ...state.sistema.data,
        sistema: state.sistema.sistema,
        state: state.sistema.state,
        fetching: state.sistema.fetching
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(SistemaActions.sistemaCleanTable()),
    setState: (state) => dispatch(SistemaActions.sistemaSetState(state)),
    salvar: (obj) => dispatch(SistemaActions.sistemaSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)