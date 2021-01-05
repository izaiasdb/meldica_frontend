import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, Select, Input, Button, Table, Icon, Card, Divider, Drawer } from 'antd'
import { generateOptions, getTitle } from '../../../util/helper'
import { openNotification } from '../../../util/notification'
import { isNil, isEmpty, trim, isEqual } from 'lodash'
import create from '../../../../services/CepApi'
import { INSERTING, EDITING, VIEWING } from '../../../util/state'

const Option = Select.Option

export default class DrawerTabelaPreco extends React.Component {
    constructor(props){
        super(props)
    }    

    render() {
        const { 
            tabelaPrecoList = [],
            tabelaPrecoProdutoList = [],
            onCloseDrawer,
            drawerVisivel,
            idTabelaPreco
        } = this.props

        let tabelaPreco = tabelaPrecoList.find(c=> c.id == idTabelaPreco)

        return (<div>
            <Drawer
                title="Tabela preço"
                width={720}
                onClose={onCloseDrawer}
                visible={drawerVisivel}
                bodyStyle={{ paddingBottom: 80 }}
                >          
                    <Row gutter = { 12 }>
                        <Col span={ 16 }>
                            <Form.Item label={"Nome"}>
                                {
                                        <Input maxLength={ 200 } disabled value={tabelaPreco ? tabelaPreco.nome : ''} />
                                }
                            </Form.Item>
                        </Col>             
                    </Row> 
                    <Row gutter = { 12 }>
                        <Form.Item label={"Produto"}>
                            {
                                <Table rowKey={(row) => row.id || row.produto && row.produto.id} size={"small"} 
                                    pagination={false} bordered
                                    dataSource={tabelaPrecoProdutoList}>
                                    <Table.Column title={<center>Produto</center>} key={"produto"} dataIndex={"produto"} align={"center"} 
                                                render={(produto = {}) => produto.descricao || produto.nome }/>
                                    <Table.Column title={<center>Valor</center>} key={"valor"} dataIndex={"valor"} align={"center"} />
                                </Table>
                            }
                        </Form.Item>
                    </Row>                         
            </Drawer>  
        </div>)
    }
}