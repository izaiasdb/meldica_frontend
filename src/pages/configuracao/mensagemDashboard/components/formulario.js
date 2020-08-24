import React, { Component } from 'react'
import { Card , Row , Col , Button , Form , Input , Select , DatePicker , Modal } from 'antd'
import { generateOptions , getTitle } from '../../../util/helper'
import moment from 'moment'
import { isEqual } from 'lodash'
import { SEARCHING, INSERTING, EDITING } from '../../../util/state'
import { connect } from 'react-redux'
import MensagemDashboardActions from '../redux'
import { openNotification } from '../../../util/notification'
import { hasAnyAuthority , getUnidadesAcesso } from '../../../../services/authenticationService'
import { isNil } from 'lodash'

class Formulario extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { state, form: { setFieldsValue }, obj } = this.props
        if (isEqual(state, EDITING)) {
            setFieldsValue({
                obj: {
                    ...obj,
                    dataInicio: obj.dataInicio ? new moment(obj.dataInicio, 'YYYY-MM-DD') : null,
                    dataFim: obj.dataFim ? new moment(obj.dataFim, 'YYYY-MM-DD') : null,
                }
            })
        }
    }

    render() {
        const unidades = getUnidadesAcesso() || []
        const { fetching , profile , form: { getFieldDecorator } } = this.props
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        const idUnidadeAtual = !isNil(profile) && !isNil(profile.unidadeAtual) && !isNil(profile.unidadeAtual.id) ? profile.unidadeAtual.id : null;

        return (
            <Form>
                <Card title={getTitle(this.isSaving() ? 'Cadastro Mensagem Dashboard' :  'Edição Mensagem Dashboard')} >
                    {getFieldDecorator("obj.id", { initialValue: null })(<Input type="hidden" />)}
                    {getFieldDecorator("obj.ativo", { initialValue: null })(<Input type="hidden" />)}
                    {getFieldDecorator("obj.idUsuarioInclusao", { initialValue: null })(<Input type="hidden" />)}
                    
                    <Row gutter={8}>
                        <Col span={5}>
                            <Form.Item label={"Unidade Prisional"}>
                                {
                                    getFieldDecorator('obj.unidade.id', {
                                        rules: [{required: true, message: 'Por favor, informe a unidade.'}],
                                        initialValue: idUnidadeAtual
                                    })(
                                        <Select showSearch disabled
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option key={1} value={null}>{"Selecione"}</Select.Option>
                                            {generateOptions(unidades.map(({id, abreviacao}) => ({id, descricao: abreviacao})))}
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={"Título"}>
                                {
                                    getFieldDecorator('obj.titulo', {
                                        rules: [{ required: true, message: 'Por favor, informe o título da  mensagem.' }]
                                    })(
                                        <Input maxLength={60} onInput={toInputUppercase} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={"Data Inicial"}>
                                {
                                    getFieldDecorator('obj.dataInicio', {
                                        rules: [{ required: true, message: 'Informe a data inicial.' }]
                                    })(<DatePicker format={'DD/MM/YYYY'} />)
                                }
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={"Data Final"}>
                                {
                                    getFieldDecorator('obj.dataFim', {
                                    })(<DatePicker format={'DD/MM/YYYY'} />)
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label={"Mensagem"}>
                                {
                                    getFieldDecorator('obj.descricao', {
                                        rules: [{ required: true, message: 'Por favor, informe a mensagem.' }]
                                    })(<Input.TextArea maxLength={512} 
                                        autoSize={{ minRows: 3, maxRows: 5 }} onInput={toInputUppercase} />)
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row style={{ textAlign: "right" }}>
                        <Button type={"primary"}
                            onClick={this.voltar}
                            style={{ marginRight: '10px' }}>
                            Voltar
                        </Button>

                        {this.isSaving() &&
                            <Button type={"primary"} 
                                disabled={!hasAnyAuthority("MENSAGEM_DASHBOARD_INSERIR")}
                                onClick={this.handleSubmit}>
                                Salvar
                            </Button>
                        }   

                        {!this.isSaving() &&
                            <Button type={"primary"} 
                                disabled={!hasAnyAuthority("MENSAGEM_DASHBOARD_ALTERAR")}
                                onClick={this.handleSubmit}>
                                Atualizar
                            </Button>
                        }
                        
                    </Row>
                </Card>
            </Form>
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

    handleReset = () => {
        this.props.form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, { obj }) => {
            if (!err) {
                this.props.salvar(obj)
                if (this.isSaving()) {
                    this.handleReset()
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
        ...state.mensagemDashboard.data,
        obj: state.mensagemDashboard.obj,
        state: state.mensagemDashboard.state,
        fetching: state.mensagemDashboard.fetching,
        profile : state.login.data.profile,
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: () => dispatch(MensagemDashboardActions.mensagemDashboardCleanMessage()),
    cleanTable: () => dispatch(MensagemDashboardActions.mensagemDashboardCleanTable()),
    pesquisar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardPesquisar(obj)),
    setState: (state) => dispatch(MensagemDashboardActions.mensagemDashboardSetState(state)),
    salvar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardSalvar(obj)),
    editar: () => dispatch(MensagemDashboardActions.mensagemDashboardEditar()),
})

const wrapedFormulario = Form.create()(Formulario)
export default connect(mapStateToProps, mapDispatchToProps)(wrapedFormulario)