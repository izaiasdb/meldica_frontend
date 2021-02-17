import React, { Component } from 'react'
import { Card, Row, Col, Button, Form, Spin, Select, Input, DatePicker, Switch, Modal } from 'antd'
import { isEqual, get, isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import UnidadeMedidaActions from '../redux'

class Formulario extends Component {
    
    constructor(props){
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const message = get(nextProps, ['message'], "")

        if (!isEmpty(message)){
            openNotification(message)
        
            if (isEqual(message.tipo, 'success')) {
                const { unidadeMedida } = this.props
                
                if (unidadeMedida.id){
                    this.props.cleanTable()
                    this.props.setStateView(SEARCHING)
                } else {
                    this.handleReset()
                    this.props.setUnidadeMedida(null)
                }
            }

            this.props.cleanMessage()
        }
    }    

    render() {
        const { 
            fetching,
            keyHandler,
            state,
            form: { getFieldDecorator },
            unidadeMedida
        } = this.props
        const { 
            id,
            nome, 
            ativo,
            idUsuarioInclusao,
            dataInclusao
        } = unidadeMedida || {}        
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };

        return (
            <Spin spinning={fetching}>
              <Form onSubmit={this.handleSubmit} >
                <Card title={ getTitle(`${this.isSaving() ? 'Cadastro' : 'Edição'}  Unidades de Medida`) } >
                    { getFieldDecorator("unidadeMedida.id", { initialValue: id })(<Input type="hidden" />) }
                    { getFieldDecorator("unidadeMedida.idUsuarioInclusao", { initialValue: isNil(idUsuarioInclusao) ? null : idUsuarioInclusao})(<Input type="hidden" />) }
                    <Row gutter={24}>                        
                        <Col span={ 8 }>
                            <Form.Item label={"Nome"}>
                                {
                                    getFieldDecorator('unidadeMedida.nome', {
                                        rules: [{ required: true, message: 'Por favor, informe o nome.' }],
                                        initialValue: nome || null
                                    })(
                                        <Input maxLength={ 100 } onKeyUp={keyHandler} onInput={toInputUppercase} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={ 2 }>
                            <Form.Item label={"Ativo"}>
                            {
                                getFieldDecorator('unidadeMedida.ativo', {
                                    initialValue: isNil(ativo) ? true : ativo,
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
                                    getFieldDecorator('unidadeMedida.dataInclusao', {
                                        rules: [{required: false}],
                                        initialValue: dataInclusao ? new moment(dataInclusao) : new moment()
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

    isSaving = () => isEqual(this.props.stateView, INSERTING)

    voltar = () => {
        const { confirm } = Modal;
        const { setStateView } = this.props;

        confirm({
            title: 'Tem certeza que deseja sair?',
            content: 'Os dados informados serão perdidos.',
            onOk() {
                setStateView(SEARCHING);
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
        this.props.form.validateFields((err, { unidadeMedida }) => {
            if (!err) {

                this.props.setUnidadeMedida(unidadeMedida)
                this.props.salvar(unidadeMedida)                
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };    
}

const mapStateToProps = (state) => {

    return {
        ...state.unidadeMedida.data,
        unidadeMedida: state.unidadeMedida.unidadeMedida,
        stateView: state.unidadeMedida.stateView,
        fetching: state.unidadeMedida.fetching,    
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: ()  => dispatch(UnidadeMedidaActions.unidadeMedidaCleanMessage()),
    cleanTable: () => dispatch(UnidadeMedidaActions.unidadeMedidaCleanTable()),    
    setStateView: (stateView) => dispatch(UnidadeMedidaActions.unidadeMedidaSetStateView(stateView)),
    salvar: (obj) => dispatch(UnidadeMedidaActions.unidadeMedidaSalvar(obj)),
    setUnidadeMedida: (obj) => dispatch(UnidadeMedidaActions.unidadeMedidaSetUnidadeMedida(obj)),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)