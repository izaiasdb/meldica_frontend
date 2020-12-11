import React from 'react'
import { connect } from 'react-redux'
import Actions from '../redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, InputNumber, Input } from 'antd'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import NumericInput from '../../../util/numericInput'
import { INSERTING, EDITING } from '../../../util/state'
import { isEqual } from 'lodash'

const Option = Select.Option

class TabItems extends React.Component {

    state = { 
        descricao: null,
        viewStateTab: INSERTING,
    }

    adicionar = () => {
        const { 
            form: { getFieldValue, getFieldsValue, setFieldsValue }, 
            produtoList = [],
        } = this.props

        let { tabelaPrecoItem } = getFieldsValue(['tabelaPrecoItem'])
        let { produto, valor } = tabelaPrecoItem

        if(!(produto && produto.id && valor)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos restantes.'})
            return null        
        }    

        let produtoItemsList = getFieldValue("tabelaPreco.produtoItemsList")

        if (tabelaPrecoItem.id){
            let oldRegistro = produtoItemsList.find(c=> c.id == tabelaPrecoItem.id)

            const index = produtoItemsList.indexOf(oldRegistro);

            if (index > -1) {
                produtoItemsList.splice(index, 1);
            }          
        } else {
            let oldRegistro = produtoItemsList.find(c=> c.produto.id == tabelaPrecoItem.produto.id)

            const index = produtoItemsList.indexOf(oldRegistro);

            if (index > -1) {
                produtoItemsList.splice(index, 1);
            } 
        }

        //produto.descricao = this.state.descricao
        let prod = produtoList.find(c=> c.id == produto.id)
        produto.descricao = prod.nome
        produtoItemsList.push({...tabelaPrecoItem})

        setFieldsValue({tabelaPreco: { produtoItemsList } }, () => {
            setFieldsValue({
                tabelaPrecoItem: {
                    id: null,
                    produto: { id: null }, valor: null
                }
            })
        })

        this.setState({ descricao: null, viewStateTab: INSERTING })
    }
    
    remover = (tabelaPrecoItem, { getFieldValue, setFieldsValue }) => {
        let produtoItemsList = getFieldValue("tabelaPreco.produtoItemsList")
        produtoItemsList.splice(produtoItemsList.findIndex((rel) => {            
            return (rel.produto.id === tabelaPrecoItem.produto.id) &&
                   (rel.valor === tabelaPrecoItem.valor)
        }), 1)
        setFieldsValue({tabelaPrecoItem: { produtoItemsList } })
        this.setState({ viewStateTab: INSERTING })
    }

    handleChange = (value, option, property) => {
        this.setState({[property]: option.props.children})
    }

    prepareUpdate = (tabelaPrecoItem) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ tabelaPrecoItem: {...tabelaPrecoItem } } )
        this.setState({ viewStateTab: EDITING, descricao: tabelaPrecoItem.produto.nome })
    } 

    // remover = (index) => {
    //     const { form: {getFieldValue, setFieldsValue } } = this.props
    //     let produtoItemsList = getFieldValue("tabelaPreco.produtoItemsList")
    //     produtoItemsList = produtoItemsList.filter((e, indexx) => indexx != index)
    //     setFieldsValue({tabelaPreco: { produtoItemsList }})
    //     this.setState({ viewStateTab: INSERTING })
    // }

    limpar = () => {
        const { form: { getFieldsValue, setFieldsValue } } = this.props
        const fields = getFieldsValue()
        fields.tabelaPrecoItem = {
            id: null,
            produto: { id: null }, valor: null
        }
        setFieldsValue(fields)
        this.setState({ viewStateTab: INSERTING })
    }

    render() {
    const { 
        form,        
        produtoList = [],
        tabelaPrecoPesquisarProduto,
        tabelaPreco = {},
    } = this.props
    const { produtoItemsList = [] } = tabelaPreco || {}
    const { getFieldDecorator, getFieldValue } = form
    const { viewStateTab } = this.state

    const id = getFieldValue("tabelaPrecoItem.id") || null

    return (<div>
        { getFieldDecorator("tabelaPrecoItem.id", { initialValue: id })(<Input type="hidden" />) }
        <Row gutter = { 12 }>
            <Col span = { 8 }>
                <Form.Item label={"Produtos"}>
                    {
                        getFieldDecorator('tabelaPrecoItem.produto.id', {})(
                            <Select showSearch
                                    optionFilterProp="children"
                                    placeholder={"Digite para buscar"}
                                    onChange={(value, option) => this.handleChange(value, option, 'descricao')}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    //onSearch={(nome = '') => nome.length > 3}//  && tabelaPrecoPesquisarProduto({ nome, tipo: 'P' })}
                                    >
                                {generateOptions(produtoList.filter(c=> c.tipo == 'P'))}
                            </Select>
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item label={"Valor"}>
                    {
                        getFieldDecorator('tabelaPrecoItem.valor', {                            
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={1}
                            precision={2}
                            step={1}
                            />                            
                        )
                    }
                </Form.Item>
            </Col>           
            <Col span={ 6 }>
                <Form.Item label={<span style={{height: '3px'}} />}>
                    {
                        <>
                        <Button type={"primary"} onClick={() => this.adicionar(form)}>{ isEqual(viewStateTab, INSERTING) ? 'Adicionar' : 'Atualizar' }</Button>
                        &nbsp;
                        <Button type={"primary"} onClick={() => this.limpar(form)} >
                            Limpar
                        </Button>
                       </>
                    }
                </Form.Item>
            </Col>
        </Row>
        <Row gutter = { 12 }>
            <Form.Item label={"Tabela Precos Produto"}>
                {
                    getFieldDecorator('tabelaPreco.produtoItemsList', {
                        rules: [{ required: true, 
                            type: 'array', message: 'Por favor, informe pelo menos um item de tabelaPreco.'}],
                        initialValue: [...produtoItemsList],
                        valuePropName: 'dataSource'
                    })(
                        <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                               pagination={false} bordered>
                            <Table.Column title={<center>Produto</center>} key={"produto"} dataIndex={"produto"} align={"center"} 
                                          render={(produto = {}) => produto.descricao || produto.nome }/>
                            <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                            <Table.Column title={<center>Ações</center>} key={"actions"} 
                                          dataIndex={"actions"} 
                                          align={"center"} 
                                          render={ (text, record) => {
                                            const {produto = {}} = record
                                            return (
                                                <span>
                                                    {
                                                        <>
                                                        <Icon style={{cursor: 'pointer'}} type={"edit"} onClick={(e) => this.prepareUpdate(record)} /> 
                                                        <Divider type="vertical"/>
                                                        </>
                                                    }
                                                    {
                                                        !record.id &&
                                                        <>
                                                        <Icon style={{cursor: 'pointer'}} type={"delete"} onClick={ () => this.remover(record, form) }/>
                                                        <Divider type="vertical"/>
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
    </div>)
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.tabelaPreco.data,
        tabelaPreco: state.tabelaPreco.tabelaPreco,
        state: state.tabelaPreco.state,
        fetching: state.tabelaPreco.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    tabelaPrecoPesquisarProduto: (obj) => dispatch(Actions.tabelaPrecoPesquisarProduto(obj)),
    setTabelaPrecoItems: (tabelaPrecoItems) => dispatch(Actions.tabelaPrecoSetTabelaPrecoItems(tabelaPrecoItems))
})

export default connect(mapStateToProps, mapDispatchToProps)(TabItems)