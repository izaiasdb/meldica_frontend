import React from 'react'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, Input, Tag, InputNumber, Card, Switch } from 'antd'
import { isEqual, isNil } from 'lodash'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'
import { obterPercentualDesconto, obterValorDesconto } from '../../../util/moneyUtils'
import DrawerKitProduto from './drawerKitProduto'

const Option = Select.Option

export default class TabKit extends React.Component {

    state = { 
        viewStateTab: INSERTING,
    }

    adicionar = () => {
        const { 
            form: { getFieldValue, getFieldsValue, setFieldsValue },
        } = this.props
        const { viewStateTab } = this.state

        let { osKit } = getFieldsValue(['osKit'])
        let kitList = getFieldValue("ordemServico.kitList")
        let { id, nome, valorNf, codigo } = osKit      
        
        if(!(nome && valorNf)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos referentes ao kit.'})
            return null
        }     

        let recordInserido = kitList.find(c=> c.nome == nome)

        if ((isEqual(viewStateTab, INSERTING) && recordInserido) || 
            (isEqual(viewStateTab, EDITING) && recordInserido && recordInserido.id != id)) {
            openNotification({tipo: 'warning', descricao: 'Kit já cadastrado.'})
            return null            
        }      

        if (id){
            let oldRegistro = kitList.find(c=> c.id == id)

            const index = kitList.indexOf(oldRegistro);

            //Apaga o anterior
            if (index > -1) {
                kitList.splice(index, 1);
            }          
        }   

        osKit.cancelado = false;

        if (isNil(osKit.codigo)){
            osKit.codigo = kitList.length + 1
        }

        kitList.push({...osKit})

        setFieldsValue({ordemServico: { kitList } }, () => {
            setFieldsValue({
                osKit: { 
                    //id: null,
                    nome: '', //'KIT DE AMOSTRA GRÁTIS', 
                    valorNf: 0,
                    codigo: null
                }
            })
        })

        this.setState({ viewStateTab: INSERTING })
    }    

    prepareUpdate = (record) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ osKit: {...record, 
        } } )
        this.setState({ viewStateTab: EDITING })
    }    
    
    remover = (record, { getFieldValue, setFieldsValue }) => {
        let kitList = getFieldValue("ordemServico.kitList")

        kitList.splice(kitList.findIndex((item) => {            
            return (item.nome === record.nome)
        }), 1)

        setFieldsValue({ordemServico: { kitList } })
    }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue }, } = this.props
        const fields = getFieldsValue()
        fields.osKit = {
            //id: null,
            nome: '', //'KIT DE AMOSTRA GRÁTIS', 
            valorNf: 0,
            codigo: null
        }

        this.setState({ viewStateTab: INSERTING })
        setFieldsValue(fields)
    }   

    getExtra() {
        const { viewStateTab } = this.state
        const { stateView, form: { getFieldValue }, ordemServico = {}, } = this.props
        let idTabelaPreco = getFieldValue("ordemServico.tabelaPreco.id")
        
        return (
            <>
                <Button 
                    type={"primary"} 
                    onClick={() => this.adicionar()}
                    disabled= {isEqual(stateView, VIEWING) || isNil(idTabelaPreco) }>
                    { isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' } Kit
                </Button>
                &nbsp;
                <Button 
                    type={"primary"} 
                    onClick={this.limpar} 
                    disabled= {isEqual(stateView, VIEWING)}>
                    Limpar
                </Button>
            </>
        )
    }

    render() {
        const { viewStateTab, produtoDescricao } = this.state
        const { 
            form,        
            ordemServico = {},      
            stateView, 
            showDrawerKit,
            drawerKitVisivel,
            setKitProdutoListEvent,
        } = this.props
        const { kitList = [] } = ordemServico || {}
        const { getFieldDecorator, getFieldValue } = form

        const toInputUppercase = e => { e.target.value = ("" + e.target.value).toUpperCase(); };        

        const idForm = getFieldValue("osKit.id") || null
        const codigoForm = getFieldValue("osKit.codigo") || null
        
        return (<div>
            <Card title={"Informe os dados referente aos produtos da Ordem de Serviço"} extra={this.getExtra()}>
                { getFieldDecorator("osKit.id", { initialValue: idForm })(<Input type="hidden" />) }
                { getFieldDecorator("osKit.codigo", { initialValue: codigoForm })(<Input type="hidden" />) }
                <Row gutter = { 12 }>
                    <Col span = { 6 }>
                        <Form.Item label={"Nome Kit"}>
                            {
                                 getFieldDecorator('osKit.nome', {
                                    rules: [{ required: false, whitespace: true, message: 'Por favor, informe o nome.' }],
                                    initialValue: null //'KIT DE AMOSTRA GRÁTIS'
                                })(
                                    <Input 
                                        maxLength={ 100 } 
                                        onInput={toInputUppercase} 
                                        disabled= {isEqual(stateView, VIEWING)}/>
                                )
                            }
                        </Form.Item>               
                    </Col>
                    <Col span={2}>
                        <Form.Item label={"Valor NF"}>
                            {
                                getFieldDecorator('osKit.valorNf', {
                                    initialValue: 1
                                })(
                                    <InputNumber style={{ width: "150" }} 
                                        min={0}
                                        precision={3}
                                        step={1}  
                                        disabled= {isEqual(stateView, VIEWING)}
                                    />
                                )
                            }
                        </Form.Item>            
                    </Col> 
                    <Col span={ 4 }>
                        <Button type="primary" 
                            onClick={showDrawerKit} style={{ marginTop: "40px" }}
                            disabled={isNil(codigoForm) || !isEqual(stateView, EDITING)}>
                            <Icon type="plus" /> Itens do Kit
                        </Button>
                    </Col>
                </Row>  
                <Row gutter = { 12 }>
                    <Form.Item label={"Kit de Produtos"}>
                        {
                            getFieldDecorator('ordemServico.kitList', {
                                rules: [{ required: false, type: 'array', message: 'Por favor, informe pelo menos um produto.'}],
                                initialValue: [...kitList],
                                valuePropName: 'dataSource'
                            })(
                                <Table rowKey={(row) => row.id || row.codigo } size={"small"} 
                                    pagination={false} bordered>
                                    <Table.Column title={<center>Nome Kit</center>} key={"nome"} dataIndex={"nome"} align={"center"} />  
                                    <Table.Column title={<center>Valor NF</center>} key={"valorNf"} dataIndex={"valorNf"} align={"center"} />
                                    <Table.Column title={<center>Ações</center>} key={"actions"} 
                                                dataIndex={"actions"} 
                                                align={"center"} 
                                                render={ (text, record) => {
                                                    return (
                                                        <span>
                                                            {
                                                                !isEqual(stateView, VIEWING) &&
                                                                <>
                                                                <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(record, form) }/>
                                                                <Divider type="vertical"/>
                                                                </>
                                                            }
                                                            {
                                                                record.id && !isEqual(stateView, VIEWING) &&
                                                                <>                                                    
                                                                    <Icon style={{cursor: 'pointer'}} type={ 'edit' } onClick={(e) => this.prepareUpdate(record)}></Icon> 
                                                                </>
                                                            }
                                                        </span>
                                                    )}
                                                }/>
                                </Table>
                            )
                        }
                    </Form.Item>
                </Row>
            </Card>

            <DrawerKitProduto {...this.props} //onCloseDrawerKit={this.onCloseDrawerKit} 
                drawerKitVisivel={drawerKitVisivel} 
                idKit={idForm} 
                codigoPai={codigoForm}
                setKitProdutoListEvent={setKitProdutoListEvent}
                />
        </div>)
    }
}
