import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal } from 'antd'
import { isEqual, get } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import ModuloActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    componentDidMount() {
        const { state, form: { setFieldsValue }, modulo } = this.props        

        if(isEqual(state, EDITING)) {
            setFieldsValue({ 
                modulo: {
                    ...modulo,
                    dataInclusao: modulo.dataInclusao ? new moment(modulo.dataInclusao, 'YYYY-MM-DD') : null,
                }
            })

            //console.log(setFieldsValue())
        }
    }

    render() {
        const { 
            fetching,
            keyHandler,
            state,
            form: { getFieldDecorator },
            sistemas = [],
            modulo
        } = this.props
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Módulo`) } >
                    { getFieldDecorator("modulo.id", { initialValue: null })(<Input type="hidden" />) }
                    { getFieldDecorator("modulo.idUsuarioInclusao", { initialValue: null })(<Input type="hidden" />) }
                    { getFieldDecorator("modulo.sistema.id", { initialValue: null })(<Input type="hidden" />) }
                    <Row gutter={24}>
                        <Col span={ 8 }>
                            <Form.Item label={"Sistema"} >
                                {
                                    getFieldDecorator('modulo.sistema.id', {
                                        rules: [{required: true, message: 'Informe o sistema.'}],
                                        initialValue: null
                                    })(
                                    <Select showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}                                            >
                                            <Select.Option key={1} value={null}>{"Selecione"}</Select.Option>
                                            {generateOptions(sistemas.map(({id, abreviado: descricao}) => ({id, descricao})))}
                                    </Select>
                                    )
                                }                                
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('modulo.nome', {
                                        rules: [{ required: true, message: 'Por favor, informe o nome.' }]
                                    })(
                                        <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('modulo.ativo', {
                                    initialValue: true,
                                    valuePropName: 'checked'                                    
                                })(
                                    <Switch />
                                )
                            }
                            </Form.Item>
                        </Col>                                                  
                        <Col span={ 4 }>
                            <Form.Item label={"Data inclusão"} style={{marginTop: '-4px'}}>
                                {
                                    getFieldDecorator('modulo.dataInclusao', {
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
        this.props.form.validateFields((err, { modulo }) => {
            if (!err) {
                this.props.salvar(modulo)

                if (this.isSaving()) {
                    this.handleReset()
                    this.props.setState(SEARCHING)
                    this.props.cleanTable()
                } else {
                    this.props.cleanTable()
                    //this.voltar()
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
        ...state.modulo.data,
        modulo: state.modulo.modulo,
        state: state.modulo.state,
        fetching: state.modulo.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanTable: () => dispatch(ModuloActions.moduloCleanTable()),
    setState: (state) => dispatch(ModuloActions.moduloSetState(state)),
    salvar: (obj) => dispatch(ModuloActions.moduloSalvar(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)