import React from 'react'
import { connect } from 'react-redux'
import Actions from '../redux'
import { Row, Col, Form, Select, Button, Table, Icon, Divider, InputNumber } from 'antd'
import { generateOptions } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import NumericInput from '../../../util/numericInput'

const Option = Select.Option

class TabItems extends React.Component {

    state = { 
        descricao: null,
    }

    adicionar = () => {
        const { 
            form: { getFieldValue, getFieldsValue, setFieldsValue }, 
        } = this.props

        let { produtoItem } = getFieldsValue(['produtoItem'])
        let { produtoFilho, quantidade } = produtoItem

        if(!(produtoFilho && produtoFilho.id && quantidade)){
            openNotification({tipo: 'warning', descricao: 'Por favor, preencha todos os campos restantes.'})
            return null        
        }    

        produtoFilho.descricao = this.state.descricao
        let produtoItemsList = getFieldValue("produto.produtoItemsList")
        produtoItemsList.push({...produtoItem})

        setFieldsValue({produto: { produtoItemsList } }, () => {
            setFieldsValue({
                produtoItem: {
                    produtoFilho: { id: null }, quantidade: null
                }
            })
        })

        this.setState({ descricao: null })
    }
    
    remover = (produtoItem, { getFieldValue, setFieldsValue }) => {
        let produtoItemsList = getFieldValue("produto.produtoItemsList")
        produtoItemsList.splice(produtoItemsList.findIndex((rel) => {            
            return (rel.produtoFilho.id === produtoItem.produtoFilho.id) &&
                   (rel.quantidade === produtoItem.quantidade)
        }), 1)
        setFieldsValue({produtoItem: { produtoItemsList } })
    }

    handleChange = (value, option, property) => {
        this.setState({[property]: option.props.children})
    }

    render() {
    const { 
        form,        
        produtoList = [],
        produtoPesquisar,
        produto = {},
        obrigaItems,
        tipoProduto
    } = this.props
    const { produtoItemsList = [] } = produto || {}
    const { getFieldDecorator } = form
    let produtoListFilter = []
    
    if (tipoProduto == 'P'){
        produtoListFilter = produtoList.filter(c=> c.tipo == 'I')
    } else if (tipoProduto == 'C'){
        produtoListFilter = produtoList.filter(c=> c.tipo == 'P')
    }    

    return (<div>
        <Row gutter = { 12 }>
            <Col span = { 8 }>
                <Form.Item label={"Produto"}>
                    {
                        getFieldDecorator('produtoItem.produtoFilho.id', {})(
                            <Select showSearch
                                    optionFilterProp="children"
                                    placeholder={"Digite para buscar"}
                                    onChange={(value, option) => this.handleChange(value, option, 'descricao')}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onSearch={(nome = '') => nome.length > 3 && produtoPesquisar({ nome, tipo: 'I' })}
                                    >
                                {generateOptions(produtoListFilter)}
                            </Select>
                        )
                    }
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item label={"Quantidade"}>
                    {
                        getFieldDecorator('produtoItem.quantidade', {                            
                        })(
                            <InputNumber style={{ width: "150" }}
                            min={1}
                            precision={3}
                            step={1}
                            />                            
                        )
                    }
                </Form.Item>
            </Col>           
            <Col span={ 6 }>
                <Form.Item label={<span style={{height: '3px'}} />}>
                    {
                        <Button type={"primary"} onClick={() => this.adicionar(form)}>Adicionar</Button>
                    }
                </Form.Item>
            </Col>
        </Row>
        <Row gutter = { 12 }>
            <Form.Item label={"Produtos Items"}>
                {
                    getFieldDecorator('produto.produtoItemsList', {
                        rules: [{ required: obrigaItems ? true : false, 
                            type: 'array', message: 'Por favor, informe pelo menos um item de produto.'}],
                        initialValue: [...produtoItemsList],
                        valuePropName: 'dataSource'
                    })(
                        <Table rowKey={(row) => row.id || row.produtoFilho && row.produtoFilho.id} size={"small"} 
                               pagination={false} bordered>
                            <Table.Column title={<center>Produto</center>} key={"produtoFilho"} dataIndex={"produtoFilho"} align={"center"} 
                                          render={(produtoFilho = {}) => produtoFilho.descricao || produtoFilho.nome }/>
                            <Table.Column title={<center>Quantidade</center>} key={"quantidade"} dataIndex={"quantidade"} align={"center"} />
                            <Table.Column title={<center>Ações</center>} key={"actions"} 
                                          dataIndex={"actions"} 
                                          align={"center"} 
                                          render={ (text, record) => {
                                            const {produtoFilho = {}} = record
                                            return (
                                                <span>
                                                    {
                                                        <>
                                                        <Icon style={{cursor: 'pointer'}} type={"edit"} onClick={this.showModal}/>
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
        ...state.produto.data,
        produto: state.produto.produto,
        state: state.produto.state,
        fetching: state.produto.fetching,   
        profile: state.login.data.profile,      
    }
}

const mapDispatchToProps = (dispatch) => ({
    produtoPesquisar: (obj) => dispatch(Actions.produtoPesquisarProduto(obj)),
    setProdutoItems: (produtoItems) => dispatch(Actions.produtoSetProdutoItems(produtoItems))
})

export default connect(mapStateToProps, mapDispatchToProps)(TabItems)