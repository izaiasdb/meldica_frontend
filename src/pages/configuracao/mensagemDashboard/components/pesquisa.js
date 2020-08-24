import React, { Component } from 'react'
import { Card, Row , Col , Input , Button , Select , Form , Divider} from 'antd'
import { generateOptions , getTitle } from '../../../util/helper'
import { isEqual , isNil } from 'lodash'
import { SEARCHING } from '../../../util/state'
import { connect } from 'react-redux'
import MensagemDashboardActions from '../redux'
import { openNotification } from '../../../util/notification'
import { getUnidadesAcesso, getUser , hasAnyAuthority } from '../../../../services/authenticationService'
import { INSERTING } from '../../../util/state'

class Pesquisa extends Component {

    componentDidMount() {
        const { state, form: { setFieldsValue }, obj } = this.props
        if(isEqual(state, SEARCHING)) {
            setFieldsValue({ 
                obj: {
                    ...obj,
                    user : getUser(),
                }
             })
        }        
    }

    getExtra = () => {
        return (
            <div>
                <Button type={"primary"}
                    htmlType="submit"
                    disabled = {!hasAnyAuthority("MENSAGEM_DASHBOARD_CONSULTAR")}
                    onClick={this.pesquisar} >
                    Pesquisar
                </Button>
                <Divider type="vertical"/>
                <Button type={"primary"}
                    onClick={this.limpar} >
                    Limpar
                </Button>
                <Divider type="vertical"/>
                <Button type={"primary"}
                    disabled = {!hasAnyAuthority("MENSAGEM_DASHBOARD_INSERIR")}
                    onClick={this.prepareInsert} >
                    Cadastrar Mensagem
                </Button>                
            </div>
        )
    }

    prepareInsert = () => {
        this.props.setState(INSERTING)
        this.props.setMensagemDashboard(null)
    }    

    pesquisar = e => {
        this.props.cleanTable();
        e.preventDefault();
        this.props.form.validateFields((err, { obj }) => {
            if (!err) {
                this.props.pesquisar(obj)
            } else {
                openNotification({tipo: 'warning', descricao: 'Existem campos obrigatórios a serem preenchidos.'})
            }
        });
    };

    limpar = () => {
        const { cleanTable, form: { resetFields } } = this.props
        cleanTable()
        resetFields()
    }
    
    render() {
        const unidades = getUnidadesAcesso() || []
        const { profile , form: { getFieldDecorator }} = this.props
        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };
        const idUnidadeAtual = !isNil(profile) && !isNil(profile.unidadeAtual) && !isNil(profile.unidadeAtual.id) ? profile.unidadeAtual.id : null;

        return (
            <Form>
                <Card title={getTitle("Pesquisa Mensagem Dashboard")}
                    extra={this.getExtra()}
                    style={{ marginBottom: '10px' }}>
                    
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item label={"Unidade prisional"}>
                                {
                                    getFieldDecorator('obj.unidade', {
                                        initialValue: [idUnidadeAtual],
                                    })(
                                        <Select placeholder={"Selecionar unidades prisionais"}
                                            showSearch={true} allowClear={true}
                                            mode={'multiple'} maxTagCount={15}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                            {generateOptions(unidades && unidades.map(({ id, abreviacao }) => ({ id, descricao: abreviacao })))}
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"Título"}>
                                {
                                    getFieldDecorator('obj.titulo', {
                                        initialValue: null
                                    })(
                                        <Input placeholder={"Selecionar título contendo"} 
                                            maxLength={60} onInput={toInputUppercase}  />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={"Período vigente"}>
                                {
                                    getFieldDecorator('obj.periodoVigente', {
                                        initialValue: [true]
                                    })(
                                        <Select showSearch allowClear={true}
                                            mode={'multiple'}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option key={1} value={true}>{"SIM"}</Select.Option>
                                            <Select.Option key={2} value={false}>{"NÃO"}</Select.Option>
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={"Ativa"}>
                                {
                                    getFieldDecorator('obj.ativo', {
                                        initialValue: [true]
                                    })(
                                        <Select showSearch allowClear={true}
                                            mode={'multiple'}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option key={2} value={true}>{"SIM"}</Select.Option>
                                            <Select.Option key={3} value={false}>{"NÃO"}</Select.Option>
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    
                </Card>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.mensagemDashboard.data,
        fetching: state.mensagemDashboard.fetching,
        profile : state.login.data.profile,
    }
}

const mapDispatchToProps = (dispatch) => ({
    cleanMessage: () => dispatch(MensagemDashboardActions.mensagemDashboardCleanMessage()),
    cleanTable: () => dispatch(MensagemDashboardActions.mensagemDashboardCleanTable()),
    pesquisar: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardPesquisar(obj)),
    setState: (state) => dispatch(MensagemDashboardActions.mensagemDashboardSetState(state)),
    setMensagemDashboard: (obj) => dispatch(MensagemDashboardActions.mensagemDashboardSetMensagemDashboard(obj)),    
})

const wrapedPesquisa = Form.create()(Pesquisa)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapedPesquisa)