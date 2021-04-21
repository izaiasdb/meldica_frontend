import React, { useRef } from 'react'
//import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Table, Drawer, DatePicker } from 'antd'
import moment from 'moment'
import { isNil, isEmpty, trim, isEqual } from 'lodash'

//import { generateOptions, getTitle } from '../../../util/helper'
//import { openNotification } from '../../../util/notification'
//import create from '../../../../services/CepApi'
//import { INSERTING, EDITING, VIEWING } from '../../../util/state'

const Option = Select.Option

export default class DrawerUltimaCompra extends React.Component {
    constructor(props){
        super(props)
    }    

    render() {
        const { 
            form: {getFieldValue},
            onCloseDrawer,
            drawerVisivel,                      
            ordemServicoUltimaCompraCliente,
            clienteList = [],
            empresaList = [],
            transportadoraList = [],
            tipoEndereco = [{
                id: 1,
                descricao: "COMERCIAL"
            },{
                id: 2,
                descricao: "RESIDENCIAL"
            }],            
        } = this.props
        const { 
            id,
            statusNovaDescricao, 
            dataVenda,
            produtoItemsList = [], 
            formaItemsList = [], 
            transportadoraItemsList = [],             
        } = ordemServicoUltimaCompraCliente || {}

        let idClienteFrm = getFieldValue("ordemServico.cliente.id")
        let cliente = clienteList.find(c=> c.id == idClienteFrm)

        return (<div>
            <Drawer
                title="Última compra do cliente"
                //width={720}
                width={"75%"}
                onClose={onCloseDrawer}
                visible={drawerVisivel}
                bodyStyle={{ paddingBottom: 80 }}
                >          
                    <Row gutter = { 12 }>
                        <Col span={ 2 }>
                            <Form.Item label={"Número nota"}>
                                {
                                    <Input disabled value={id} />
                                }
                            </Form.Item>
                        </Col>                                     
                        <Col span={ 4 }>
                            <Form.Item label={"Status nota"}>
                                {
                                    <Input disabled value={statusNovaDescricao} />
                                }
                            </Form.Item>
                        </Col>      
                        <Col span={ 4 }>
                            <Form.Item label={"Data venda"}>
                                {
                                    <DatePicker 
                                        style = {{ width: '98%' }}
                                        value = {isNil(dataVenda) ? moment() : new moment(dataVenda)}
                                        disabled
                                        format={'DD/MM/YYYY'}/>
                                }
                            </Form.Item>                            
                        </Col>      
                        <Col span={ 8 }>
                            <Form.Item label={"Cliente"}>
                                {
                                    <Input disabled value={cliente ? cliente.nome : ''} />
                                }
                            </Form.Item>
                        </Col>             
                    </Row> 
                    <Row gutter = { 12 }>
                        <Form.Item label={"Produto"}>
                            {
                                <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                                    pagination={false} bordered
                                    dataSource={produtoItemsList}
                                    >
                                    <Table.Column title={<center>Produto</center>} key={"nomeProduto"} dataIndex={"nomeProduto"} align={"center"} />  
                                    <Table.Column title={<center>Qtd. cx's</center>} key={"quantidadeCaixa"} dataIndex={"quantidadeCaixa"} align={"center"} />    
                                    <Table.Column title={<center>Qtd. unids.</center>} key={"quantidadeUnidade"} dataIndex={"quantidadeUnidade"} align={"center"} />
                                    <Table.Column title={<center>Valor(unit)</center>} key={"valorUnidade"} dataIndex={"valorUnidade"} align={"center"} />
                                    <Table.Column title={<center>Valor(cx)</center>} key={"valorCaixa"} dataIndex={"valorCaixa"} align={"center"} />
                                    <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                    <Table.Column title={<center>Valor c/ desc.</center>} key={"total2"} dataIndex={"total2"} align={"center"}
                                        render={(text, record) => record.fracionado ?
                                             (record.valorUnidade - record.desconto) : 
                                             (record.valorCaixa - record.desconto)  } />
                                    <Table.Column title={<center>NF unit.</center>} key={"valorNfUnidade"} dataIndex={"valorNfUnidade"} align={"center"} />
                                    <Table.Column title={<center>NF cx</center>} key={"valorNfCaixa"} dataIndex={"valorNfCaixa"} align={"center"} />
                                    <Table.Column title={<center>Total(C/ Desc.)</center>} key={"total"} dataIndex={"total"} align={"center"} />
                                    <Table.Column title={<center>Bonif.</center>} key={"bonificacao"} dataIndex={"bonificacao"} align={"center"}
                                        render={(text, record) => record.bonificacao ? 'SIM' : 'NÃO'} />                                       
                                </Table>
                            }
                        </Form.Item>
                    </Row>
                    <Row gutter = { 12 }>
                        <Form.Item label={"Forma de pagamento"}>
                            {
                                <Table rowKey={(row) => row.id || row.formaCondicaoPagamento && row.formaCondicaoPagamento.id} size={"small"} 
                                    //expandedRowRender={(record, index, indent, expanded) => expandedRowRender(record, index, indent, expanded) }
                                    pagination={false} bordered
                                    dataSource={formaItemsList}
                                >
                                <Table.Column title={<center>Forma pagamento</center>} key={"nomeFormaPagamento"} dataIndex={"nomeFormaPagamento"} align={"center"} />
                                <Table.Column title={<center>Condição pagamento</center>} key={"nomeCondicaoPagamento"} dataIndex={"nomeCondicaoPagamento"} align={"center"} />
                                <Table.Column title={<center>Empresa</center>} 
                                        key={"idEmpresa"} 
                                        dataIndex={"idEmpresa"} 
                                        align={"center"} 
                                        render={ (text) => empresaList.map(d => { if(d.id == text) return d.nome }) }
                                        />    
                                <Table.Column title={<center>Tipo Forma</center>} 
                                        key={"tipoForma"} 
                                        dataIndex={"tipoForma"} 
                                        align={"center"} 
                                        render={ (text) => text == "P" ? "PRODUTO" : "FRETE" }
                                        />                                                                              
                                <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                <Table.Column title={<center>Desconto</center>} key={"desconto"} dataIndex={"desconto"} align={"center"} />
                                <Table.Column title={<center>Total c/ desconto</center>} key={"total"} dataIndex={"total"} align={"center"}
                                    render={
                                        (text, record) => (record.valor - record.desconto).toFixed(2)
                                    } />
                            </Table>                                
                            }
                        </Form.Item>
                    </Row>     
                    <Row gutter = { 12 }>
                        <Form.Item label={"Transportadora"}>
                            {
                            <Table rowKey={(row) => row.id || row.cep} 
                                size={"small"} 
                                pagination={false}
                                bordered
                                dataSource={transportadoraItemsList}>
                                <Table.Column title={<center>Transportadora</center>} 
                                            key={"transportadora.id"} 
                                            dataIndex={"transportadora.id"} 
                                            align={"center"} 
                                            render={ (text) => transportadoraList.map(d => { if(d.id == text) return d.nome }) }
                                            />                                        
                                <Table.Column title={<center>Tipo</center>} 
                                            key={"idTipoEndereco"} 
                                            dataIndex={"idTipoEndereco"} 
                                            align={"center"} 
                                            render={ (text) => tipoEndereco.map(d => { if(d.id == text) return d.descricao }) }
                                            />
                                <Table.Column title={<center>CEP</center>} key={"cep"} dataIndex={"cep"} align={"center"} />
                                <Table.Column title={<center>Logradouro</center>} key={"logradouro"} dataIndex={"logradouro"} align={"center"} />
                                <Table.Column title={<center>Número</center>} key={"numero"} dataIndex={"numero"} align={"center"} />
                                <Table.Column title={<center>Complemento</center>} key={"complemento"} dataIndex={"complemento"} align={"center"} />
                                <Table.Column title={<center>Bairro</center>} key={"bairro"} dataIndex={"bairro"} align={"center"} />
                                <Table.Column title={<center>Cidade</center>} key={"cidade"} dataIndex={"cidade"} align={"center"} 
                                            render={(text, record) => `${text ? text : ''}${isNil(record.uf) ? '' : ' - '+record.uf}`}
                                                />
                                <Table.Column title={<center>Vl. Frete</center>} key={"valorFrete"} dataIndex={"valorFrete"} align={"center"} />
                                <Table.Column title={<center>Vl. redespacho</center>} key={"valorRedespacho"} dataIndex={"valorRedespacho"} align={"center"} />
                                </Table>                                
                            }
                        </Form.Item>
                    </Row>                                                                                              
            </Drawer>  
        </div>)
    }
}